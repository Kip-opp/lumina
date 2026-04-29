const { storeImportedMessage, getImportedMessages } = require('../services/supabaseService');

/**
 * Fetch and store messages from connected services
 */
const fetchAndStoreMessages = async (service, userId, provider) => {
  try {
    const messages = await service.getRecentMessages(userId);

    const storedMessages = [];
    for (const message of messages) {
      try {
        const storedMessage = await storeImportedMessage(userId, provider, message);
        storedMessages.push(storedMessage);
      } catch (error) {
        console.error(`Error storing ${provider} message:`, error);
      }
    }

    return storedMessages;
  } catch (error) {
    throw new Error(`Failed to fetch ${provider} messages: ${error.message}`);
  }
};

/**
 * Get messages for a user
 */
const getMessages = async (userId, provider = null, limit = 50, offset = 0) => {
  try {
    return await getImportedMessages(userId, provider, limit, offset);
  } catch (error) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }
};

module.exports = {
  fetchAndStoreMessages,
  getMessages
};