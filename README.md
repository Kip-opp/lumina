# Lumina - AI-Powered Writing Assistant

A modern, intelligent writing assistant built with React that leverages AI to provide comprehensive feedback, suggestions, and improvements for your written content. Enhance your writing quality with automated grammar checks, style recommendations, clarity improvements, and contextual suggestions.

## ✨ Features

- **AI-Powered Text Analysis**: Advanced analysis using OpenAI GPT or local Ollama models for grammar, style, and clarity improvements
- **Real-time Feedback**: Instant suggestions categorized by type (grammar, style, clarity)
- **Contextual Writing Support**: Support for different writing types and custom instructions
- **Reply Generation**: AI-generated responses for various communication scenarios
- **Tone Variations**: Multiple tone options for your writing (professional, casual, friendly, etc.)
- **File Upload Support**: Analyze content from uploaded files
- **Responsive Design**: Clean, modern UI built with Tailwind CSS and shadcn/ui components
- **Secure Authentication**: Supabase-powered user authentication and data management

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI API / Ollama (local LLM)
- **State Management**: React Query for server state
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager
- Supabase account (for authentication and database)
- OpenAI API key (for AI features) OR Ollama installed (for local AI)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone  git@github.com:Kip-opp/lumina.git 
   cd lumina
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env` and configure your environment variables:
   ```bash
   cp .env .env.local
   ```

   Configure the following variables in `.env.local`:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # AI Provider Selection (true for Ollama, false for OpenAI)
   VITE_USE_OLLAMA=false

   # OpenAI Configuration
   VITE_OPENAI_API_KEY=sk-your-openai-api-key
   VITE_OPENAI_MODEL=gpt-4o-mini

   # Ollama Configuration (if using local AI)
   VITE_OLLAMA_BASE_URL=http://localhost:11434
   VITE_OLLAMA_MODEL=deepseek-v3.1:671b-cloud
   ```

4. **Supabase Setup**
   - Create a new project at [supabase.com](https://supabase.com)
   - Enable authentication in your Supabase dashboard
   - Copy your project URL and anon key to the `.env` file

5. **AI Setup Options**

   **Option A: OpenAI (Cloud)**
   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Set `VITE_USE_OLLAMA=false` and add your key

   **Option B: Ollama (Local)**
   - Install Ollama from [ollama.com](https://ollama.com)
   - Pull a model: `ollama pull deepseek-v3.1:671b-cloud`
   - Start the server: `ollama serve`
   - Set `VITE_USE_OLLAMA=true`

## 🎯 Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

3. **Sign up/Login**
   Create an account or sign in to access the writing assistant

4. **Start Writing**
   - Enter your text in the editor
   - Click "Analyze Text" for AI-powered feedback
   - Apply suggestions individually or in bulk
   - Generate replies or tone variations as needed

## 🔧 Configuration

### Writing Context Options

The app supports different writing contexts:
- **Writing Type**: Email, article, report, social media, etc.
- **Reference Text**: Additional context for analysis
- **File Content**: Upload and analyze existing documents
- **Output Instructions**: Custom guidelines for AI responses

### AI Model Selection

Switch between AI providers by changing `VITE_USE_OLLAMA`:
- `false`: Uses OpenAI (requires API key)
- `true`: Uses local Ollama instance

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── writing/         # Writing-specific components
│       ├── SuggestionPanel.jsx  # Main suggestions interface component
│       ├── SuggestionCard.jsx   # Individual suggestion display
│       └── ReplyIdeas.jsx       # Reply and tone variation UI
├── lib/
│   ├── ai-service.js    # AI integration logic
│   ├── supabase.js      # Supabase client setup
│   ├── AuthContext.jsx  # Authentication context
│   └── utils.js         # Utility functions
├── pages/
│   └── WritingAssistant.jsx  # Main application page
└── hooks/               # Custom React hooks
```

### Key Components

#### SuggestionPanel.jsx
The core suggestions interface component that provides a comprehensive AI-powered writing assistance panel. Key architectural features include:

- **Tabbed Interface**: Organizes suggestions into logical categories (All, Fixes, Rewrite, Full Reply Ideas, Tone Variations) with dynamic badge counts
- **Intelligent Filtering**: Automatically categorizes AI suggestions by type (grammar fixes, style improvements, clarity enhancements)
- **State Management**: Manages complex UI states including loading indicators, disabled states, and tab navigation
- **Animation Integration**: Uses Framer Motion's AnimatePresence for smooth suggestion transitions and layout changes
- **Responsive Design**: Implements horizontal scrolling tabs and adaptive layouts for various screen sizes
- **User Experience**: Provides contextual empty states with examples and progressive disclosure of features based on content availability
- **AI Integration**: Seamlessly connects to the AI service for generating reply ideas and tone variations on-demand
- **Accessibility**: Implements proper ARIA labels, keyboard navigation, and visual feedback for all interactive elements

This component serves as the primary interaction point for users to review, apply, or dismiss AI-generated suggestions, making it a critical piece of the application's user experience architecture.

## 🧪 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run typecheck
```

## 🔒 Security Considerations

- API keys are exposed to the client (VITE_ prefix)
- Consider backend proxy for production AI calls
- Supabase RLS policies should be configured for data security
- Regular dependency updates to address security vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Supabase](https://supabase.com/) and [OpenAI](https://openai.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This application uses AI services that may incur costs. Monitor your OpenAI usage if using cloud AI, and ensure Ollama is properly configured for local usage.