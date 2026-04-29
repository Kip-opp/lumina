const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const aiProxyService = require('../services/aiProxyService');

/**
 * Analyze text using AI
 */
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { text, writingContext } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    const result = await aiProxyService.analyzeText(text, writingContext || {});

    res.json(result);
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate tone variations
 */
router.post('/generate-tones', authenticateToken, async (req, res) => {
  try {
    const { text, writingContext } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required and must be a string' });
    }

    const result = await aiProxyService.generateTones(text, writingContext || {});

    res.json(result);
  } catch (error) {
    console.error('Tone generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;