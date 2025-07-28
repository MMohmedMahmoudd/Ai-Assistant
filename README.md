# AI TextPal - AI Chat Assistant

A modern AI chat application built with React, TypeScript, and Express.js.

## Features

- 🤖 AI-powered chat with Google Gemini and Hugging Face models
- 💬 Real-time messaging with conversation history
- ⚙️ Customizable settings and model parameters
- 🎨 Modern, responsive UI with dark/light themes
- 🔐 API key management for different AI providers

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **AI Services**: Google Gemini, Hugging Face
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: GitHub Pages (Frontend), Vercel/Railway (Backend)

## Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MMohmedMahmoudd/Ai-Assistant.git
cd Ai-Assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your API keys
   GEMINI_API_KEY=your_gemini_api_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   DATABASE_URL=your_database_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Deployment

### GitHub Pages (Frontend)

The frontend is automatically deployed to GitHub Pages when you push to the `main` branch.

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages"
   - Set source to "GitHub Actions"

2. **Deploy manually** (optional)
   ```bash
   npm run deploy
   ```

### Backend Deployment

For the backend, you have several options:

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Update frontend API URL**
   Update `client/src/lib/staticMode.ts` with your Vercel URL

#### Option 2: Railway

1. **Connect your GitHub repository**
2. **Set environment variables**
3. **Deploy automatically**

#### Option 3: Render

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Set build command**: `npm run build`
4. **Set start command**: `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Optional |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## API Keys Setup

### Google Gemini
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Add it to your environment variables or settings

### Hugging Face
1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new access token
3. Add it to your environment variables or settings

## Project Structure

```
Ai-Assistant/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and configurations
│   │   └── types/        # TypeScript type definitions
│   └── index.html
├── server/                # Backend Express app
│   ├── services/         # AI service integrations
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
└── dist/                 # Build output
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues:

1. Check the [Issues](https://github.com/MMohmedMahmoudd/Ai-Assistant/issues) page
2. Create a new issue with detailed information
3. Include your environment and error logs

---

**Note**: For production use, make sure to:
- Use proper API key management
- Set up a production database
- Configure CORS properly
- Add rate limiting
- Set up monitoring and logging 