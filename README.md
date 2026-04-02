# Lumina - AI-Powered Writing Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF.svg)](https://vitejs.dev/)

Lumina is a sophisticated web-based writing assistant that harnesses the power of Large Language Models (LLMs) to provide intelligent, context-aware writing feedback and enhancements. Built with modern web technologies, it offers real-time AI-driven analysis for grammar, style, clarity, and tone improvements, making it an indispensable tool for writers, professionals, and content creators.

The application features a clean, responsive interface with tabbed suggestion panels, seamless authentication via Supabase, and flexible AI integration supporting both cloud-based OpenAI models and local Ollama instances for privacy-conscious users.

## ✨ Features

### Core Writing Analysis
- **AI-Powered Text Analysis**: Leverages advanced LLMs (OpenAI GPT-4 or local Ollama models) for comprehensive text evaluation
- **Multi-Category Feedback**: Automatically categorizes suggestions into grammar fixes, style improvements, and clarity enhancements
- **Real-time Processing**: Instant analysis with loading states and progress indicators
- **Scoring System**: Provides quantitative writing quality scores (0-100) with qualitative assessments

### Advanced Writing Tools
- **Contextual Intelligence**: Supports domain-specific writing contexts (emails, articles, reports, social media, etc.)
- **Reply Generation**: AI-crafted response templates for various communication scenarios
- **Tone Adaptation**: Generates multiple tone variations (Formal, Casual, Enthusiastic, Empathetic) for the same content
- **File Integration**: Upload and analyze existing documents with preserved formatting context

### User Experience
- **Tabbed Interface**: Organized suggestion panels with dynamic badge counts and filtering
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices with adaptive layouts
- **Dark/Light Mode**: Theme support with system preference detection
- **Version History**: Maintains writing iterations with restore functionality

### Security & Privacy
- **Flexible AI Options**: Choose between cloud-based AI (OpenAI) or local processing (Ollama) for data privacy
- **Secure Authentication**: Supabase-powered auth with row-level security (RLS)
- **Input Validation**: Comprehensive client-side validation with Zod schemas
- **Production Logging**: Environment-aware error handling without sensitive data exposure

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2.0**: Modern React with hooks, concurrent features, and automatic batching
- **Vite 6.1.0**: Fast build tool with native ES modules, Hot Module Replacement (HMR), and optimized production builds

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework with custom design system
- **shadcn/ui**: High-quality, accessible component library built on Radix UI primitives
- **Framer Motion 11.16.4**: Production-ready motion library for React animations
- **Lucide React 0.475.0**: Beautiful, consistent icon library

### Backend & Infrastructure
- **Supabase 2.100.1**: Open-source Firebase alternative providing authentication, real-time database, and API
- **OpenAI API 6.33.0**: Integration with GPT models for AI-powered text analysis
- **Ollama**: Local LLM execution for privacy-focused AI processing

### Development Tools
- **React Hook Form 7.54.2**: Performant forms with easy validation integration
- **Zod 3.24.2**: TypeScript-first schema validation with excellent developer experience
- **React Query 5.84.1**: Powerful data synchronization for server state
- **ESLint 9.19.0**: Code linting with React and accessibility rules
- **TypeScript 5.8.2**: Static type checking for enhanced code reliability

### Security & Validation
- **Input Validation**: Zod-based schemas for all user inputs
- **Error Handling**: Production-safe logging with environment-aware behavior
- **Security Headers**: Content Security Policy (CSP) and X-Content-Type-Options implemented

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **Package Manager**: npm (comes with Node.js) or yarn
- **Operating System**: macOS, Windows, or Linux with modern browser support

### External Services
- **Supabase Account**: Required for authentication and user data management
  - Free tier available at [supabase.com](https://supabase.com)
  - Project with authentication enabled

### AI Provider (Choose One)
- **OpenAI API**: For cloud-based AI processing
  - API key from [OpenAI Platform](https://platform.openai.com/api-keys)
  - Paid service with usage-based pricing
- **Ollama**: For local AI processing (privacy-focused, no API costs)
  - Download from [ollama.com](https://ollama.com)
  - Requires ~8GB RAM for recommended models
  - Local LLM execution (no internet required for inference)

### Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Kip-opp/lumina.git
cd lumina
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create environment file:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:
```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# AI Provider Selection (Required: true for Ollama, false for OpenAI)
VITE_USE_OLLAMA=false

# OpenAI Configuration (Required if VITE_USE_OLLAMA=false)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
VITE_OPENAI_MODEL=gpt-4o-mini

# Ollama Configuration (Required if VITE_USE_OLLAMA=true)
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b
```

### 4. Supabase Setup

1. **Create Supabase Project**
   - Visit [supabase.com](https://supabase.com) and create a new project
   - Wait for project initialization (may take a few minutes)

2. **Configure Authentication**
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable email/password authentication
   - Configure site URL: `http://localhost:5173` (for development)

3. **Get API Keys**
   - Navigate to Settings > API in your dashboard
   - Copy Project URL and anon/public key to `.env.local`

### 5. AI Provider Setup

#### Option A: OpenAI (Cloud)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add the key to `VITE_OPENAI_API_KEY` in `.env.local`
4. Ensure `VITE_USE_OLLAMA=false`

#### Option B: Ollama (Local)
1. Download and install Ollama from [ollama.com](https://ollama.com)
2. Install a model: `ollama pull llama3.2:3b` (or your preferred model)
3. Start Ollama server: `ollama serve`
4. Set `VITE_USE_OLLAMA=true` in `.env.local`
5. Update `VITE_OLLAMA_MODEL` to match your installed model

## 🎯 Usage

### Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Application Workflow

1. **Authentication**
   - Create a new account or sign in with existing credentials
   - Supabase handles secure authentication with email verification

2. **Writing Context Setup** (Optional)
   - Configure writing type (email, article, report, etc.)
   - Add reference text for additional context
   - Upload files for analysis (preserves formatting context)

3. **Text Analysis**
   - Enter or paste your writing in the main editor (minimum 10 characters)
   - Click "Analyze Text" to trigger AI analysis
   - View categorized suggestions in the right panel:
     - **Fixes**: Grammar and spelling corrections
     - **Rewrite**: Style and clarity improvements
     - **All**: Complete suggestion list

4. **Interactive Suggestions**
   - Review AI-generated suggestions with explanations
   - Apply individual suggestions or dismiss unwanted ones
   - View overall writing quality score

5. **Advanced Features**
   - **Reply Ideas**: Generate complete response templates
   - **Tone Variations**: Create multiple versions with different tones
   - **Version History**: Track and restore previous iterations

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Analyze text
- `Ctrl/Cmd + Z`: Undo text changes
- Tab navigation through suggestion panels

### Mobile Usage
- Responsive design optimized for tablets and phones
- Touch-friendly interface with swipe gestures
- Collapsible panels for smaller screens

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key | `eyJhbGc...` |
| `VITE_USE_OLLAMA` | Yes | AI provider selection | `false` (OpenAI) or `true` (Ollama) |
| `VITE_OPENAI_API_KEY` | If OpenAI | OpenAI API key | `sk-...` |
| `VITE_OPENAI_MODEL` | If OpenAI | GPT model name | `gpt-4o-mini` |
| `VITE_OLLAMA_BASE_URL` | If Ollama | Ollama server URL | `http://localhost:11434` |
| `VITE_OLLAMA_MODEL` | If Ollama | Installed model name | `llama3.2:3b` |

### Writing Context Configuration

#### Supported Writing Types
- **Email**: Business, personal, or marketing communications
- **Article/Blog**: Web content, journalism, or editorial writing
- **Report**: Business reports, academic papers, or documentation
- **Social Media**: Posts, tweets, or social content
- **Creative Writing**: Stories, scripts, or narrative content
- **Technical**: API docs, code comments, or technical specifications

#### Advanced Context Options
- **Reference Text**: Additional background information for AI analysis
- **File Upload**: Support for `.txt`, `.md`, `.docx` files (content extracted and analyzed)
- **Custom Instructions**: Specific guidelines for AI response generation
- **Tone Preferences**: Pre-defined tone settings for consistent output

### AI Model Configuration

#### OpenAI Integration
- **Supported Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- **Rate Limiting**: Respects OpenAI API limits (60 requests/minute)
- **Cost Optimization**: Uses efficient prompting to minimize token usage
- **Fallback Handling**: Graceful degradation on API errors

#### Ollama Integration
- **Local Processing**: All AI inference happens on local hardware
- **Model Flexibility**: Support for any Ollama-compatible model
- **Performance**: Dependent on local hardware capabilities
- **Offline Capability**: Works without internet connection for inference

### Performance Tuning

#### Bundle Optimization
- Code splitting for faster initial load times
- Tree shaking removes unused dependencies
- CSS optimization with Tailwind purging

#### Caching Strategy
- React Query caching for API responses
- Local storage for user preferences
- Service worker for offline functionality (planned)

## 🏗️ Project Structure

```
lumina/
├── public/                    # Static assets
│   ├── manifest.json         # PWA manifest
│   └── favicon files
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   │   ├── Button.jsx   # Custom button component with variants
│   │   │   ├── Card.jsx     # Card container components
│   │   │   ├── Input.jsx    # Form input components
│   │   │   └── ...          # Additional shadcn/ui components
│   │   └── writing/         # Domain-specific writing components
│   │       ├── Header.jsx           # Top navigation and controls
│   │       ├── TextEditor.jsx       # Main text editing interface
│   │       ├── SuggestionPanel.jsx  # Core suggestions display
│   │       ├── SuggestionCard.jsx   # Individual suggestion item
│   │       ├── ReplyIdeas.jsx       # Reply generation UI
│   │       ├── ContextPanel.jsx     # Writing context configuration
│   │       ├── ScoreOverview.jsx    # Writing quality metrics
│   │       └── WritingStats.jsx     # Word count and progress
│   ├── lib/
│   │   ├── ai-service.js    # AI integration and API calls
│   │   ├── supabase.js      # Supabase client configuration
│   │   ├── AuthContext.jsx  # Authentication state management
│   │   ├── validation.js    # Input validation schemas (Zod)
│   │   ├── logger.js        # Production-safe logging utility
│   │   └── utils.js         # Helper functions
│   ├── pages/
│   │   └── WritingAssistant.jsx  # Main application page
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js       # Authentication hook
│   ├── App.jsx              # Root application component
│   └── main.jsx             # Application entry point
├── dist/                    # Production build output
├── node_modules/            # Dependencies
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── jsconfig.json           # JavaScript project configuration
└── README.md               # Project documentation
```

### Architecture Overview

#### Component Architecture
The application follows a modular component architecture with clear separation of concerns:

- **UI Components** (`src/components/ui/`): Reusable, themeable components built on shadcn/ui
- **Writing Components** (`src/components/writing/`): Domain-specific components for writing functionality
- **Pages** (`src/pages/`): Route-level components representing application screens

#### State Management
- **Local State**: React hooks (`useState`, `useCallback`) for component-level state
- **Server State**: React Query (TanStack Query) for API data fetching and caching
- **Authentication State**: Context API with Supabase integration

#### Data Flow
1. User input captured in TextEditor component
2. Writing context configured via ContextPanel
3. AI analysis triggered via ai-service.js
4. Results processed and displayed in SuggestionPanel
5. User interactions (apply/dismiss) update local state

### Key Components Deep Dive

#### SuggestionPanel.jsx - Core Interaction Hub
The SuggestionPanel serves as the central nervous system for user-AI interaction:

**Architectural Features:**
- **State-Driven UI**: Complex state management coordinating tab navigation, loading states, and suggestion filtering
- **Performance Optimized**: Uses React.memo and selective re-rendering to handle large suggestion lists efficiently
- **Animation System**: Framer Motion integration for smooth transitions and micro-interactions
- **Responsive Layout**: Adaptive design that transforms from desktop sidebar to mobile tabs

**Technical Implementation:**
- **Filtering Logic**: Real-time categorization of suggestions with O(n) complexity optimization
- **Accessibility Layer**: Full keyboard navigation and screen reader support
- **Error Boundaries**: Graceful error handling for AI service failures
- **Progressive Enhancement**: Features unlock based on content availability

#### AI Service Layer (ai-service.js)
Centralizes all AI interactions with robust error handling:

**Provider Abstraction:**
- Unified interface for OpenAI and Ollama providers
- Automatic provider switching based on environment configuration
- Request/response normalization for consistent data structures

**Error Resilience:**
- Network failure handling with exponential backoff
- Response validation and sanitization
- User-friendly error messages without technical details

**Performance Considerations:**
- Request debouncing for rapid typing scenarios
- Response caching for repeated analyses
- Memory management for large text processing

#### Authentication System
Supabase-powered authentication with security best practices:

**Security Features:**
- JWT token management with automatic refresh
- Row-level security (RLS) policies
- Secure password handling and validation
- OAuth provider integration capability

**User Experience:**
- Seamless sign-up/sign-in flows
- Persistent sessions across browser sessions
- Progressive authentication states

## 🧪 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production with optimization
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Run TypeScript type checking
npm run typecheck
```

### Development Workflow

1. **Local Development**
   - `npm run dev` starts Vite dev server on `http://localhost:5173`
   - Hot Module Replacement (HMR) for instant updates
   - Automatic browser refresh on file changes

2. **Code Quality**
   - Pre-commit hooks ensure code quality (planned)
   - ESLint rules enforce consistent coding standards
   - TypeScript provides compile-time type safety

3. **Testing Strategy**
   - Component testing with React Testing Library (planned)
   - E2E testing with Playwright (planned)
   - Manual testing for AI integration workflows

### Build Optimization

- **Code Splitting**: Automatic route-based and component-based splitting
- **Asset Optimization**: Image compression, CSS minification, JS uglification
- **Bundle Analysis**: `npm run build -- --mode analyze` for bundle inspection
- **Progressive Web App**: Service worker for offline functionality (planned)

### Environment Management

- **Development**: Full debugging, console logging, development APIs
- **Production**: Optimized builds, error tracking, performance monitoring
- **Staging**: Mirror of production for testing (recommended setup)

## 🔒 Security Considerations

### Implemented Security Measures

#### Input Validation & Sanitization
- **Client-Side Validation**: Zod schemas validate all user inputs before processing
- **Type Safety**: TypeScript prevents type-related vulnerabilities
- **Content Sanitization**: User-generated content is validated and sanitized

#### Authentication & Authorization
- **Supabase Auth**: Secure JWT-based authentication with automatic token refresh
- **Row-Level Security**: Database policies ensure users can only access their own data
- **Session Management**: Secure session handling with automatic logout on inactivity

#### Error Handling & Logging
- **Production-Safe Logging**: Environment-aware logging prevents sensitive data exposure
- **User-Friendly Errors**: Generic error messages hide internal implementation details
- **Graceful Degradation**: Application continues functioning during service outages

#### Network Security
- **Content Security Policy**: Strict CSP prevents XSS attacks and unauthorized resource loading
- **Secure Headers**: X-Content-Type-Options and other security headers implemented
- **HTTPS Enforcement**: All external API calls use secure protocols

### Security Best Practices

#### For Deployments
- **API Key Management**: Use environment variables, never commit secrets to version control
- **Backend Proxy**: Consider API proxy service for production to hide AI provider keys
- **Rate Limiting**: Implement request rate limiting to prevent abuse
- **Monitoring**: Set up logging and monitoring for security events

#### Dependency Management
- **Regular Updates**: Keep dependencies updated to address known vulnerabilities
- **Audit Dependencies**: Regular `npm audit` checks for security issues
- **Minimal Dependencies**: Only include necessary packages to reduce attack surface

#### Data Privacy
- **Local AI Option**: Ollama integration allows fully local processing for sensitive content
- **Data Minimization**: Only collect necessary user data
- **Retention Policies**: Implement data cleanup and retention policies

### Known Considerations
- **Client-Side Keys**: VITE_ prefixed variables are exposed to client - consider proxy for production
- **AI API Costs**: Monitor OpenAI usage to prevent unexpected charges
- **Local LLM Security**: Ollama runs locally but requires hardware security considerations

### Security Checklist
- [x] Input validation implemented
- [x] Secure authentication configured
- [x] Error handling sanitized
- [x] Security headers added
- [x] Dependencies audited
- [ ] Penetration testing completed (recommended)
- [ ] Security audit performed (recommended)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Code splitting for optimal loading
- Asset optimization and compression

### Deployment Platforms

#### Recommended: Vercel (Easiest)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Automatic deployments on git push
4. Preview deployments for pull requests

#### Alternative: Netlify
1. Connect GitHub repository
2. Configure build settings (`npm run build`)
3. Set environment variables
4. Custom domain and CDN included

#### Manual Deployment
```bash
# Build the application
npm run build

# Serve with any static hosting service
# Examples: Apache, Nginx, S3, Firebase Hosting
```

### Environment Configuration for Production
```env
# Production Supabase project (separate from development)
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Production AI configuration
VITE_USE_OLLAMA=false
VITE_OPENAI_API_KEY=your-production-openai-key
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Supabase production project created
- [ ] SSL certificate enabled
- [ ] Custom domain configured (optional)
- [ ] Error tracking set up (e.g., Sentry)
- [ ] Performance monitoring configured
- [ ] Backup strategy for user data

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible component library
- **Backend Services**: [Supabase](https://supabase.com/) - Open-source Firebase alternative
- **AI Integration**: [OpenAI](https://openai.com/) and [Ollama](https://ollama.com/) for LLM capabilities
- **Icons**: [Lucide](https://lucide.dev/) - Consistent, beautiful icon set
- **Development Tools**: Vite, React, Tailwind CSS, and the broader JavaScript ecosystem

## 📞 Support

- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/your-username/lumina/issues)
- **Discussions**: Join community discussions for questions and feedback
- **Documentation**: Check this README and inline code comments for detailed information

## 📈 Roadmap

### Planned Features
- [ ] Real-time collaborative editing
- [ ] Advanced writing analytics and insights
- [ ] Integration with popular writing platforms
- [ ] Offline mode with local AI processing
- [ ] Plugin system for custom AI models
- [ ] Team workspaces and document sharing

### Performance Improvements
- [ ] Progressive Web App (PWA) capabilities
- [ ] Service worker for offline functionality
- [ ] Advanced caching strategies
- [ ] Bundle size optimization

---

## ⚠️ Important Notes

**Cost Awareness**: This application uses AI services that may incur costs. Monitor your OpenAI API usage if using cloud AI to avoid unexpected charges.

**Local AI Setup**: When using Ollama, ensure your system has adequate resources (8GB+ RAM recommended) and keep models updated for best performance.

**Data Privacy**: Choose Ollama for fully local processing if handling sensitive content. Cloud AI processes data on external servers.

**Browser Compatibility**: Ensure your browser supports modern JavaScript features. Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+ recommended.

**Security**: Keep dependencies updated and regularly audit for vulnerabilities. The application includes security headers but additional hardening may be needed for production deployments.