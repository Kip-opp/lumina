# Lumina Backend

A robust Express.js backend for the Lumina AI Writing Assistant that handles secure API key management, OAuth flows for external services, and message ingestion.

## Features

- **Secure API Key Management**: All API keys are stored server-side, never exposed to the frontend
- **OAuth Integration**: Connect Gmail, Twitter, LinkedIn, and Slack accounts securely
- **Message Ingestion**: Import emails, tweets, posts, and messages for AI analysis
- **AI Proxy Service**: Secure proxy for OpenAI/Ollama API calls
- **Supabase Integration**: User authentication and data persistence

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **External APIs**: Google (Gmail), Twitter, LinkedIn, Slack
- **AI**: OpenAI API or Ollama (local LLM)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env` and fill in your API keys and configuration:
   ```bash
   cp .env .env.local
   ```

3. **Database Setup**
   Run the SQL schema in your Supabase project:
   ```sql
   -- Copy contents from database-schema.sql
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `GET /api/auth/verify` - Verify user authentication

### Gmail Integration
- `GET /api/oauth/gmail/auth` - Initiate Gmail OAuth flow
- `GET /api/oauth/gmail/callback` - Handle Gmail OAuth callback
- `GET /api/gmail/emails` - Get user's Gmail messages

### Twitter Integration
- `GET /api/oauth/twitter/auth` - Initiate Twitter OAuth flow
- `GET /api/oauth/twitter/callback` - Handle Twitter OAuth callback
- `GET /api/twitter/tweets` - Get user's tweets

### LinkedIn Integration
- `GET /api/oauth/linkedin/auth` - Initiate LinkedIn OAuth flow
- `GET /api/oauth/linkedin/callback` - Handle LinkedIn OAuth callback
- `GET /api/linkedin/posts` - Get user's LinkedIn posts

### Slack Integration
- `GET /api/oauth/slack/auth` - Initiate Slack OAuth flow
- `GET /api/oauth/slack/callback` - Handle Slack OAuth callback
- `GET /api/slack/messages` - Get user's Slack messages

### AI Services
- `POST /api/ai/analyze` - Analyze text with AI
- `POST /api/ai/generate-tones` - Generate tone variations

## Security

- All external API keys are stored server-side only
- User authentication required for all endpoints
- OAuth tokens encrypted and stored securely
- CORS configured for frontend domain only
- Rate limiting implemented
- Helmet.js for security headers

## Development

```bash
# Development with auto-restart
npm run dev

# Production
npm start

# Linting
npm run lint
```

## Project Structure

```
lumina-backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Express middleware
│   ├── services/        # External API integrations
│   └── utils/           # Utility functions
├── database-schema.sql  # Supabase database schema
├── .env                 # Environment variables (configure)
└── README.md
```

## Environment Variables

See `.env` file for all required environment variables. Key variables include:

- Supabase URL and service role key
- OpenAI API key
- OAuth client IDs and secrets for each service
- Frontend URL for CORS
- Server port and environment

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include JSDoc comments for new functions
4. Test OAuth flows thoroughly
5. Never commit API keys or sensitive data