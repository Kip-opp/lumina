-- Lumina Backend Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL editor

-- Table: user_oauth_tokens
CREATE TABLE IF NOT EXISTS user_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- e.g., 'google', 'twitter', 'linkedin', 'slack'
  access_token TEXT NOT NULL,
  refresh_token TEXT, -- Optional, for long-lived access
  expires_at TIMESTAMP, -- When the access token expires
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Table: imported_messages
CREATE TABLE IF NOT EXISTS imported_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- e.g., 'gmail', 'twitter', 'linkedin', 'slack'
  external_id TEXT NOT NULL, -- Unique ID from the external service
  subject TEXT, -- For emails/posts
  body TEXT, -- Content of the message
  sender TEXT, -- Who sent the message
  received_at TIMESTAMP,
  analyzed BOOLEAN DEFAULT FALSE,
  analysis_result JSONB, -- Store AI analysis results here
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider, external_id)
);

-- Table: writing_projects (Optional, for future project management)
CREATE TABLE IF NOT EXISTS writing_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  source_provider TEXT, -- e.g., 'gmail', 'manual'
  source_messages JSONB, -- Store references to imported_messages or raw text
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_oauth_tokens_user_provider ON user_oauth_tokens(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_imported_messages_user_provider ON imported_messages(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_imported_messages_received_at ON imported_messages(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_writing_projects_user ON writing_projects(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE imported_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_projects ENABLE ROW LEVEL SECURITY;

-- Policies for user_oauth_tokens
CREATE POLICY "Users can view their own OAuth tokens" ON user_oauth_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OAuth tokens" ON user_oauth_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OAuth tokens" ON user_oauth_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own OAuth tokens" ON user_oauth_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for imported_messages
CREATE POLICY "Users can view their own messages" ON imported_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON imported_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" ON imported_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON imported_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for writing_projects
CREATE POLICY "Users can view their own projects" ON writing_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON writing_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON writing_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON writing_projects
  FOR DELETE USING (auth.uid() = user_id);