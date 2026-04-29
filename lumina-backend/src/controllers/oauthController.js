const { storeOAuthToken } = require('../services/supabaseService');

/**
 * Handle OAuth callback and store tokens
 */
const handleOAuthCallback = async (service, userId, code) => {
  try {
    // Get tokens from the OAuth service
    const tokens = await service.getTokens(code);

    // Store tokens in database
    await storeOAuthToken(userId, service.constructor.name.toLowerCase().replace('service', ''), tokens);

    return { success: true, message: 'Account connected successfully' };
  } catch (error) {
    throw new Error(`OAuth callback failed: ${error.message}`);
  }
};

module.exports = {
  handleOAuthCallback
};