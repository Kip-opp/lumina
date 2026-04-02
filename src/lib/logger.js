// Logger utility for production-safe error handling
const isProduction = import.meta.env.PROD;

export const logger = {
  error: (message, error = null) => {
    if (!isProduction) {
      console.error(message, error);
    }
    // In production, could send to external logging service
  },
  warn: (message) => {
    if (!isProduction) {
      console.warn(message);
    }
  },
  info: (message) => {
    if (!isProduction) {
      console.info(message);
    }
  }
};