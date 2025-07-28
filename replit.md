# AI Chat Assistant - Replit Project

## Overview

This is a full-stack AI chat application built with React (frontend) and Express.js (backend). The application provides a modern chat interface for interacting with Google's Gemini AI models, featuring real-time conversations, session management, and a responsive design with dark/light theme support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Generative AI (Gemini) via @google/genai
- **Storage**: Memory storage implementation (fallback) with database schema ready
- **Session Management**: In-memory chat sessions with database backup

### Key Components

#### Frontend Components
- `ChatContainer`: Main chat interface orchestrating all chat functionality
- `MessagesList`: Displays conversation history with user and AI messages
- `MessageInput`: Text input with auto-resize and character count
- `ChatHeader`: Navigation bar with model selection and settings
- `SettingsModal`: Configuration panel for AI model settings
- `ThemeProvider`: Dark/light theme management

#### Backend Services
- `AIService`: Handles communication with Google Gemini AI models
- `Storage`: Abstracts data persistence with memory and database implementations
- `Routes`: RESTful API endpoints for chat sessions and messages

#### Database Schema
- `messages`: Stores individual chat messages with metadata
- `chatSessions`: Manages conversation sessions with timestamps

### Data Flow

1. **User Input**: User types message in `MessageInput` component
2. **State Update**: Message is sent via `useChat` hook to backend API
3. **AI Processing**: Backend forwards message to Google Gemini AI service
4. **Response Handling**: AI response is processed and stored in database
5. **UI Update**: Frontend receives response and updates chat interface
6. **Session Management**: Messages are associated with chat sessions for persistence

### External Dependencies

#### AI Services
- **Google Gemini**: Primary AI service for chat completions
- **Models**: Supports Gemini Flash and Gemini Pro variants
- **Authentication**: Uses API key-based authentication

#### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Drizzle ORM**: Type-safe database operations
- **Connection**: Uses DATABASE_URL environment variable

#### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for UI elements

### Deployment Strategy

#### Development
- **Vite Dev Server**: Hot module replacement for frontend
- **Express Server**: Node.js backend with TypeScript compilation
- **Environment**: Uses NODE_ENV=development for local development

#### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

#### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`: Google AI authentication
- `NODE_ENV`: Environment flag for development/production

#### Replit Integration
- Configured for Replit development environment
- Uses Replit-specific Vite plugins for enhanced development experience
- Cartographer plugin for code navigation in development

The application follows a clean architecture pattern with clear separation between presentation, business logic, and data layers. The frontend uses modern React patterns with hooks and context, while the backend implements RESTful API design principles. The system is designed to be scalable and maintainable, with TypeScript providing type safety throughout the stack.