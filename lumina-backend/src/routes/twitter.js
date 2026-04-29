const express = require('express');
const router = express.Router();
const { authenticateToken, requireOAuthToken } = require('../middleware/authMiddleware');
const { handleOAuthCallback } = require('../controllers/oauthController');
const { fetchAndStoreMessages, getMessages } = require('../controllers/messageController');
const twitterService = require('../services/twitterService');

/**
 * Initiate Twitter OAuth flow
 */
router.get('/auth', authenticateToken, (req, res) => {
  try {
    const state = req.userId; // Use user ID as state for security
    const { url, codeVerifier, state: oauthState } = twitterService.generateAuthUrl(state);

    // Store codeVerifier in session or temporary storage
    // For now, we'll store it in a simple in-memory map (in production, use Redis/session)
    if (!global.twitterCodeVerifiers) {
      global.twitterCodeVerifiers = new Map();
    }
    global.twitterCodeVerifiers.set(oauthState, codeVerifier);

    res.json({ authUrl: url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Twitter OAuth callback
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=${oauthError}`);
    }

    if (!code || !state) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=missing_code_or_state`);
    }

    // Get codeVerifier from temporary storage
    const codeVerifier = global.twitterCodeVerifiers?.get(state);
    if (!codeVerifier) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=invalid_state`);
    }

    // Clean up
    global.twitterCodeVerifiers.delete(state);

    // Handle the OAuth callback
    await handleOAuthCallback(twitterService, state, code);

    res.redirect(`${process.env.FRONTEND_URL}/settings?success=twitter_connected`);
  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=callback_failed`);
  }
});

/**
 * Get Twitter tweets
 */
router.get('/tweets', authenticateToken, requireOAuthToken('twitter'), async (req, res) => {
  try {
    const { limit = 10, refresh = false } = req.query;
    const userId = req.userId;

    if (refresh === 'true') {
      // Fetch fresh tweets from Twitter API
      await fetchAndStoreMessages(twitterService, userId, 'twitter');
    }

    // Get tweets from database
    const messages = await getMessages(userId, 'twitter', parseInt(limit));

    res.json({ messages });
  } catch (error) {
    console.error('Get Twitter tweets error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;