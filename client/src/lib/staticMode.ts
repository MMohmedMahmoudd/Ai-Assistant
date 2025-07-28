// Static mode configuration for GitHub Pages
export const isStaticMode = () => {
  return window.location.hostname === 'MMohmedMahmoudd.github.io' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname.includes('github.io');
};

// Fallback API endpoints for static deployment
export const getApiBaseUrl = () => {
  if (isStaticMode()) {
    // For GitHub Pages, you might want to use a different API endpoint
    // You can deploy your backend to a service like Vercel, Railway, or Render
    return 'https://your-backend-url.vercel.app';
  }
  return '';
};

// Mock API for static mode (optional)
export const createMockApi = () => {
  if (!isStaticMode()) return null;
  
  return {
    async generateResponse(message: string) {
      // Return a mock response for demo purposes
      return {
        content: `This is a demo response. In production, this would connect to a real AI service. Your message was: "${message}"`,
        model: 'demo-model',
        provider: 'demo'
      };
    }
  };
}; 