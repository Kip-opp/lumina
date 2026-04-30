# Lumina Backend

This is the backend service for the Lumina writing assistant application.

## Overview

The Lumina backend provides API endpoints for OAuth integrations, AI processing, and other services used by the Lumina frontend.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository and navigate to the `lumina-backend` directory:

   ```bash
   cd lumina-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` (if available) or copy the following template:

   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Supabase Configuration
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # OAuth Provider Configurations
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/oauth/google/callback

   # Twitter OAuth
   TWITTER_CLIENT_ID=your-twitter-client-id
   TWITTER_CLIENT_SECRET=your-twitter-client-secret
   TWITTER_REDIRECT_URI=http://localhost:3001/api/oauth/twitter/callback

   # LinkedIn OAuth
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   LINKEDIN_REDIRECT_URI=http://localhost:3001/api/oauth/linkedin/callback

   # Slack OAuth
   SLACK_CLIENT_ID=your-slack-client-id
   SLACK_CLIENT_SECRET=your-slack-client-secret
   SLACK_REDIRECT_URI=http://localhost:3001/api/oauth/slack/callback

   # AI Provider API Keys (optional, if using backend AI processing)
   OPENAI_API_KEY=your-openai-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. **Configure Supabase**:
   - Create a new project at [https://supabase.com](https://supabase.com)
   - Get your project URL and API keys from the project settings
   - In your Supabase dashboard:
     - Go to Authentication > Settings
     - Disable "Enable email confirmations" if you want users to sign up without email verification
     - Configure OAuth providers (Google, GitHub, etc.) in Authentication > Providers if using OAuth login
     - Set up SMTP settings in Authentication > Settings if you want to send confirmation emails

5. Start the development server:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001`.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/auth/verify` - Verify user authentication
- `POST /api/oauth/google` - Google OAuth
- `POST /api/oauth/twitter` - Twitter OAuth
- `POST /api/oauth/linkedin` - LinkedIn OAuth
- `POST /api/oauth/slack` - Slack OAuth
- `POST /api/ai/analyze` - AI text analysis
- `POST /api/ai/generate` - AI text generation

## Environment Variables

See the `.env` template above for all required environment variables.

## Development

- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm test` - Run tests (placeholder)

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Ensure all OAuth redirect URIs are updated to your production domain
3. Deploy to your preferred hosting service (Heroku, Vercel, AWS, etc.)

## Troubleshooting

### Authentication Issues

- Ensure Supabase credentials are correct
- Check that email confirmations are disabled in Supabase if not using SMTP
- Verify OAuth provider configurations in Supabase dashboard

### OAuth Errors

- Confirm redirect URIs match exactly in both code and provider settings
- Check that client IDs and secrets are correct
- Ensure CORS is configured to allow your frontend domain

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed