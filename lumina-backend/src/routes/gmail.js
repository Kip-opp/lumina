const express = require('express');
const router = express.Router();
const { authenticateToken, requireOAuthToken } = require('../middleware/authMiddleware');
const { handleOAuthCallback } = require('../controllers/oauthController');
const { fetchAndStoreMessages, getMessages } = require('../controllers/messageController');
const gmailService = require('../services/gmailService');

/**
 * Initiate Gmail OAuth flow
 */
router.get('/auth', authenticateToken, (req, res) => {
  try {
    const state = req.userId; // Use user ID as state for security
    const authUrl = gmailService.generateAuthUrl(state);
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Gmail OAuth callback
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

    // Handle the OAuth callback
    await handleOAuthCallback(gmailService, state, code);

    res.redirect(`${process.env.FRONTEND_URL}/settings?success=gmail_connected`);
  } catch (error) {
    console.error('Gmail OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=callback_failed`);
  }
});

/**
 * Get Gmail messages
 */
router.get('/emails', authenticateToken, requireOAuthToken('google'), async (req, res) => {
  try {
    const { limit = 10, refresh = false } = req.query;
    const userId = req.userId;

    if (refresh === 'true') {
      // Fetch fresh messages from Gmail API
      await fetchAndStoreMessages(gmailService, userId, 'gmail');
    }

    // Get messages from database
    const messages = await getMessages(userId, 'gmail', parseInt(limit));

    res.json({ messages });
  } catch (error) {
    console.error('Get Gmail emails error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;