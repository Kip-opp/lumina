const { createClient } = require('@supabase/supabase-js');

// Check if Supabase credentials are configured
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey &&
    supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
    supabaseKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('⚠️  Failed to initialize Supabase client:', error.message);
    console.warn('⚠️  Supabase features will be disabled. Authentication will be bypassed.');
  }
} else {
  console.warn('⚠️  Supabase credentials not configured. Authentication will be bypassed.');
}

/**
 * Middleware to authenticate Supabase JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    // If Supabase is not configured, bypass authentication for development
    if (!supabase) {
      req.user = { id: 'dev-user-id' }; // Mock user for development
      req.userId = 'dev-user-id';
      return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Optional middleware to check if user has OAuth tokens for a specific provider
 */
const requireOAuthToken = (provider) => {
  return async (req, res, next) => {
    try {
      // If Supabase is not configured, bypass OAuth token check for development
      if (!supabase) {
        req.oauthToken = { access_token: 'dev-token' }; // Mock token for development
        return next();
      }

      const { data, error } = await supabase
        .from('user_oauth_tokens')
        .select('*')
        .eq('user_id', req.userId)
        .eq('provider', provider)
        .single();

      if (error || !data) {
        return res.status(403).json({
          error: `No ${provider} account connected`,
          code: 'OAUTH_TOKEN_MISSING'
        });
      }

      // Check if token is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return res.status(403).json({
          error: `${provider} token expired`,
          code: 'OAUTH_TOKEN_EXPIRED'
        });
      }

      req.oauthToken = data;
      next();
    } catch (error) {
      console.error('OAuth token check error:', error);
      res.status(500).json({ error: 'Failed to verify OAuth token' });
    }
  };
};

module.exports = {
  authenticateToken,
  requireOAuthToken
};