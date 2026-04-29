const { TwitterApi } = require('twitter-api-v2');
const { storeOAuthToken, getOAuthToken, updateOAuthToken } = require('./supabaseService');

class TwitterService {
  constructor() {
    this.clientId = process.env.TWITTER_CLIENT_ID;
    this.clientSecret = process.env.TWITTER_CLIENT_SECRET;
    this.redirectUri = process.env.TWITTER_REDIRECT_URI;
  }

  /**
   * Generate OAuth authorization URL
   */
  generateAuthUrl(state = null) {
    const client = new TwitterApi({
      clientId: this.clientId,
      clientSecret: this.clientSecret
    });

    return client.generateOAuth2AuthLink(
      this.redirectUri,
      {
        scope: ['tweet.read', 'users.read', 'follows.read'],
        state: state
      }
    );
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const client = new TwitterApi({
        clientId: this.clientId,
        clientSecret: this.clientSecret
      });

      const { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
        code,
        codeVerifier: undefined, // Not needed for PKCE
        redirectUri: this.redirectUri
      });

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
        expires_at: expiresIn ? Date.now() + (expiresIn * 1000) : null
      };
    } catch (error) {
      throw new Error(`Failed to get Twitter tokens: ${error.message}`);
    }
  }

  /**
   * Create authenticated client
   */
  createAuthenticatedClient(accessToken) {
    return new TwitterApi(accessToken);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(userId) {
    try {
      const tokenData = await getOAuthToken(userId, 'twitter');
      if (!tokenData) {
        throw new Error('No Twitter token found');
      }

      const client = new TwitterApi({
        clientId: this.clientId,
        clientSecret: this.clientSecret
      });

      const { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.refreshOAuth2Token(tokenData.refresh_token);

      const newTokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
        expires_at: expiresIn ? Date.now() + (expiresIn * 1000) : null
      };

      await updateOAuthToken(userId, 'twitter', newTokens);

      return newTokens;
    } catch (error) {
      throw new Error(`Failed to refresh Twitter token: ${error.message}`);
    }
  }

  /**
   * Get recent tweets
   */
  async getRecentTweets(userId, maxResults = 10) {
    try {
      // First ensure we have valid credentials
      let tokenData = await getOAuthToken(userId, 'twitter');
      if (!tokenData) {
        throw new Error('No Twitter account connected');
      }

      // Check if token is expired and refresh if needed
      if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
        await this.refreshAccessToken(userId);
        tokenData = await getOAuthToken(userId, 'twitter');
      }

      const client = this.createAuthenticatedClient(tokenData.access_token);

      // Get user info first
      const user = await client.v2.me();
      const userIdStr = user.data.id;

      // Get recent tweets
      const tweets = await client.v2.userTimeline(userIdStr, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'text', 'author_id']
      });

      return tweets.data.map(tweet => ({
        external_id: tweet.id,
        subject: null,
        body: tweet.text,
        sender: user.data.username,
        received_at: new Date(tweet.created_at)
      }));

    } catch (error) {
      throw new Error(`Failed to get Twitter tweets: ${error.message}`);
    }
  }
}

module.exports = new TwitterService();