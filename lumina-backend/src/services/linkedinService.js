const axios = require('axios');
const { storeOAuthToken, getOAuthToken, updateOAuthToken } = require('./supabaseService');

class LinkedInService {
  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    this.baseUrl = 'https://api.linkedin.com/v2';
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state = null) {
    const scopes = 'r_liteprofile r_emailaddress w_member_social';
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes)}`;

    return authUrl + (state ? `&state=${state}` : '');
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, expires_in, refresh_token } = response.data;

      return {
        access_token,
        refresh_token,
        expires_in,
        expires_at: expires_in ? Date.now() + (expires_in * 1000) : null
      };
    } catch (error) {
      throw new Error(`Failed to get LinkedIn tokens: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(userId) {
    try {
      const tokenData = await getOAuthToken(userId, 'linkedin');
      if (!tokenData) {
        throw new Error('No LinkedIn token found');
      }

      const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'refresh_token',
        refresh_token: tokenData.refresh_token,
        client_id: this.clientId,
        client_secret: this.clientSecret
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, expires_in, refresh_token } = response.data;

      const newTokens = {
        access_token,
        refresh_token,
        expires_in,
        expires_at: expires_in ? Date.now() + (expires_in * 1000) : null
      };

      await updateOAuthToken(userId, 'linkedin', newTokens);

      return newTokens;
    } catch (error) {
      throw new Error(`Failed to refresh LinkedIn token: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Get recent posts/activities
   */
  async getRecentPosts(userId, maxResults = 10) {
    try {
      // First ensure we have valid credentials
      let tokenData = await getOAuthToken(userId, 'linkedin');
      if (!tokenData) {
        throw new Error('No LinkedIn account connected');
      }

      // Check if token is expired and refresh if needed
      if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
        await this.refreshAccessToken(userId);
        tokenData = await getOAuthToken(userId, 'linkedin');
      }

      // Get user profile first
      const profileResponse = await axios.get(`${this.baseUrl}/people/~`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      const userInfo = profileResponse.data;

      // Get recent posts (this is a simplified version - LinkedIn API for posts is complex)
      // In a real implementation, you might need to use different endpoints
      const posts = [];

      // For now, return a placeholder structure
      // LinkedIn's post API is more complex and may require UGC (User Generated Content) API
      return posts;

    } catch (error) {
      throw new Error(`Failed to get LinkedIn posts: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/people/~:(id,firstName,lastName,profilePicture,publicProfileUrl)`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get LinkedIn profile: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new LinkedInService();