const express = require('express');
const router = express.Router();
const { authenticateToken, requireOAuthToken } = require('../middleware/authMiddleware');
const { handleOAuthCallback } = require('../controllers/oauthController');
const { fetchAndStoreMessages, getMessages } = require('../controllers/messageController');
const slackService = require('../services/slackService');

/**
 * Initiate Slack OAuth flow
 */
router.get('/auth', authenticateToken, (req, res) => {
  try {
    const state = req.userId; // Use user ID as state for security
    const authUrl = slackService.generateAuthUrl(state);
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Slack OAuth callback
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
    await handleOAuthCallback(slackService, state, code);

    res.redirect(`${process.env.FRONTEND_URL}/settings?success=slack_connected`);
  } catch (error) {
    console.error('Slack OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=callback_failed`);
  }
});

/**
 * Get Slack messages
 */
router.get('/messages', authenticateToken, requireOAuthToken('slack'), async (req, res) => {
  try {
    const { limit = 10, refresh = false } = req.query;
    const userId = req.userId;

    if (refresh === 'true') {
      // Fetch fresh messages from Slack API
      await fetchAndStoreMessages(slackService, userId, 'slack');
    }

    // Get messages from database
    const messages = await getMessages(userId, 'slack', parseInt(limit));

    res.json({ messages });
  } catch (error) {
    console.error('Get Slack messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;