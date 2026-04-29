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
    console.warn('⚠️  Supabase features will be disabled.');
  }
} else {
  console.warn('⚠️  Supabase credentials not configured. Database features will be disabled.');
}

/**
 * Store OAuth tokens for a user
 */
const storeOAuthToken = async (userId, provider, tokenData) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('user_oauth_tokens')
    .upsert({
      user_id: userId,
      provider,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at ? new Date(tokenData.expires_at * 1000) : null,
      updated_at: new Date()
    }, {
      onConflict: 'user_id,provider'
    });

  if (error) {
    throw new Error(`Failed to store ${provider} token: ${error.message}`);
  }

  return data;
};

/**
 * Get OAuth tokens for a user and provider
 */
const getOAuthToken = async (userId, provider) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('user_oauth_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw new Error(`Failed to get ${provider} token: ${error.message}`);
  }

  return data;
};

/**
 * Update OAuth tokens (useful for refresh)
 */
const updateOAuthToken = async (userId, provider, tokenData) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('user_oauth_tokens')
    .update({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at ? new Date(tokenData.expires_at * 1000) : null,
      updated_at: new Date()
    })
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) {
    throw new Error(`Failed to update ${provider} token: ${error.message}`);
  }

  return data;
};

/**
 * Store imported messages
 */
const storeImportedMessage = async (userId, provider, messageData) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('imported_messages')
    .upsert({
      user_id: userId,
      provider,
      external_id: messageData.external_id,
      subject: messageData.subject,
      body: messageData.body,
      sender: messageData.sender,
      received_at: messageData.received_at,
      analyzed: messageData.analyzed || false,
      analysis_result: messageData.analysis_result
    }, {
      onConflict: 'user_id,provider,external_id'
    });

  if (error) {
    throw new Error(`Failed to store ${provider} message: ${error.message}`);
  }

  return data;
};

/**
 * Get imported messages for a user
 */
const getImportedMessages = async (userId, provider = null, limit = 50, offset = 0) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  let query = supabase
    .from('imported_messages')
    .select('*')
    .eq('user_id', userId)
    .order('received_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (provider) {
    query = query.eq('provider', provider);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }

  return data;
};

/**
 * Get connected providers for a user
 */
const getConnectedProviders = async (userId) => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('user_oauth_tokens')
    .select('provider, created_at')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to get connected providers: ${error.message}`);
  }

  return data.map(item => item.provider);
};

module.exports = {
  supabase,
  storeOAuthToken,
  getOAuthToken,
  updateOAuthToken,
  storeImportedMessage,
  getImportedMessages,
  getConnectedProviders
};