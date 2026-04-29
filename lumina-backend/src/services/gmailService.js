const { google } = require('googleapis');
const axios = require('axios');
const { storeOAuthToken, getOAuthToken, updateOAuthToken } = require('./supabaseService');

class GmailService {
  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI;

    this.oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state = null) {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      throw new Error(`Failed to get Gmail tokens: ${error.message}`);
    }
  }

  /**
   * Set credentials for API calls
   */
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(userId) {
    try {
      const tokenData = await getOAuthToken(userId, 'google');
      if (!tokenData) {
        throw new Error('No Gmail token found');
      }

      this.oauth2Client.setCredentials({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      await updateOAuthToken(userId, 'google', credentials);

      return credentials;
    } catch (error) {
      throw new Error(`Failed to refresh Gmail token: ${error.message}`);
    }
  }

  /**
   * Get recent emails
   */
  async getRecentEmails(userId, maxResults = 10) {
    try {
      // First ensure we have valid credentials
      let tokenData = await getOAuthToken(userId, 'google');
      if (!tokenData) {
        throw new Error('No Gmail account connected');
      }

      // Check if token is expired and refresh if needed
      if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
        await this.refreshAccessToken(userId);
        tokenData = await getOAuthToken(userId, 'google');
      }

      this.setCredentials(tokenData);

      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: 'newer_than:7d' // Last 7 days
      });

      if (!response.data.messages) {
        return [];
      }

      // Get full message details
      const emails = [];
      for (const message of response.data.messages) {
        try {
          const messageData = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });

          const email = this.parseEmail(messageData.data);
          if (email) {
            emails.push(email);
          }
        } catch (error) {
          console.error(`Error fetching email ${message.id}:`, error);
        }
      }

      return emails;
    } catch (error) {
      throw new Error(`Failed to get Gmail emails: ${error.message}`);
    }
  }

  /**
   * Parse Gmail message data
   */
  parseEmail(messageData) {
    try {
      const headers = messageData.payload.headers;
      const getHeader = (name) => {
        const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header ? header.value : null;
      };

      let body = '';
      if (messageData.payload.body.data) {
        body = Buffer.from(messageData.payload.body.data, 'base64').toString();
      } else if (messageData.payload.parts) {
        // Handle multipart messages
        const textPart = messageData.payload.parts.find(part =>
          part.mimeType === 'text/plain'
        );
        if (textPart && textPart.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString();
        }
      }

      return {
        external_id: messageData.id,
        subject: getHeader('Subject'),
        body: body,
        sender: getHeader('From'),
        received_at: new Date(parseInt(messageData.internalDate))
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      return null;
    }
  }
}

module.exports = new GmailService();