const { WebClient } = require('@slack/web-api');
const axios = require('axios');
const { storeOAuthToken, getOAuthToken, updateOAuthToken } = require('./supabaseService');

class SlackService {
  constructor() {
    this.clientId = process.env.SLACK_CLIENT_ID;
    this.clientSecret = process.env.SLACK_CLIENT_SECRET;
    this.redirectUri = process.env.SLACK_REDIRECT_URI;
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state = null, team = null) {
    const scopes = 'channels:history,groups:history,im:history,mpim:history,channels:read,users:read';
    let authUrl = `https://slack.com/oauth/v2/authorize?client_id=${this.clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;

    if (state) {
      authUrl += `&state=${state}`;
    }
    if (team) {
      authUrl += `&team=${team}`;
    }

    return authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const response = await axios.post('https://slack.com/api/oauth.v2.access', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.data.ok) {
        throw new Error(`Slack OAuth error: ${response.data.error}`);
      }

      const { access_token, refresh_token, expires_in, team, authed_user } = response.data;

      return {
        access_token,
        refresh_token,
        expires_in,
        expires_at: expires_in ? Date.now() + (expires_in * 1000) : null,
        team,
        authed_user
      };
    } catch (error) {
      throw new Error(`Failed to get Slack tokens: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Create authenticated client
   */
  createAuthenticatedClient(accessToken) {
    return new WebClient(accessToken);
  }

  /**
   * Refresh access token (Slack uses different token types)
   */
  async refreshAccessToken(userId) {
    // Slack doesn't typically use refresh tokens in the same way
    // Their tokens are usually long-lived, but this is here for consistency
    const tokenData = await getOAuthToken(userId, 'slack');
    if (!tokenData) {
      throw new Error('No Slack token found');
    }

    // For Slack, we might need to re-authorize if token is invalid
    throw new Error('Slack token refresh not implemented - tokens are typically long-lived');
  }

  /**
   * Get recent messages from channels
   */
  async getRecentMessages(userId, maxResults = 10) {
    try {
      // First ensure we have valid credentials
      const tokenData = await getOAuthToken(userId, 'slack');
      if (!tokenData) {
        throw new Error('No Slack workspace connected');
      }

      const client = this.createAuthenticatedClient(tokenData.access_token);

      // Get user's channels
      const channelsResponse = await client.conversations.list({
        types: 'public_channel,private_channel,im,mpim',
        limit: 20
      });

      if (!channelsResponse.ok) {
        throw new Error(`Slack API error: ${channelsResponse.error}`);
      }

      const messages = [];

      // Get recent messages from each channel
      for (const channel of channelsResponse.channels.slice(0, 3)) { // Limit to first 3 channels
        try {
          const historyResponse = await client.conversations.history({
            channel: channel.id,
            limit: Math.ceil(maxResults / 3) // Distribute across channels
          });

          if (historyResponse.ok && historyResponse.messages) {
            for (const message of historyResponse.messages) {
              if (messages.length >= maxResults) break;

              messages.push({
                external_id: `${channel.id}-${message.ts}`,
                subject: `#${channel.name}`,
                body: message.text,
                sender: message.user ? await this.getUserName(client, message.user) : 'Unknown',
                received_at: new Date(parseFloat(message.ts) * 1000)
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching messages from channel ${channel.id}:`, error);
        }

        if (messages.length >= maxResults) break;
      }

      return messages.slice(0, maxResults);

    } catch (error) {
      throw new Error(`Failed to get Slack messages: ${error.message}`);
    }
  }

  /**
   * Get user name from user ID
   */
  async getUserName(client, userId) {
    try {
      const userResponse = await client.users.info({ user: userId });
      if (userResponse.ok) {
        return userResponse.user.real_name || userResponse.user.name;
      }
      return userId;
    } catch (error) {
      return userId;
    }
  }
}

module.exports = new SlackService();