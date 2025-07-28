# Deployment Guide for GitHub Pages

## Prerequisites

1. **GitHub Repository**: Make sure your code is pushed to GitHub
2. **Node.js**: Version 18 or higher
3. **Git**: Latest version

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository is ready for deployment:

```bash
# Check if all changes are committed
git status

# If not, commit your changes
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. This will use the workflow we created in `.github/workflows/deploy.yml`

### 3. Deploy Frontend to GitHub Pages

The frontend will be automatically deployed when you push to the `main` branch. However, you can also deploy manually:

```bash
# Build the client
npm run build:client

# Deploy to GitHub Pages
npm run deploy
```

### 4. Deploy Backend (Required for Full Functionality)

Since GitHub Pages only serves static files, you need to deploy your backend separately:

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set install command: `npm install`

4. **Set Environment Variables** in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `HUGGINGFACE_API_KEY`
   - `DATABASE_URL`
   - `NODE_ENV=production`

#### Option B: Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables
4. Deploy automatically

#### Option C: Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variables

### 5. Update Frontend API URL

After deploying your backend, update the API URL in your frontend:

1. **Edit `client/src/lib/staticMode.ts`**:
   ```typescript
   export const getApiBaseUrl = () => {
     if (isStaticMode()) {
       return 'https://your-backend-url.vercel.app'; // Replace with your actual backend URL
     }
     return '';
   };
   ```

2. **Rebuild and redeploy**:
   ```bash
   npm run build:client
   npm run deploy
   ```

## Environment Variables

Make sure to set these in your backend deployment platform:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Optional |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NODE_ENV` | Set to `production` | Yes |

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check if all dependencies are installed
   - Ensure TypeScript compilation passes
   - Verify environment variables are set

2. **API Calls Fail**:
   - Check if backend is deployed and accessible
   - Verify CORS settings
   - Ensure API keys are valid

3. **GitHub Pages Not Updating**:
   - Check GitHub Actions tab for deployment status
   - Verify the workflow is running
   - Check if the `gh-pages` branch is created

### Debugging Steps

1. **Check Build Output**:
   ```bash
   npm run build:client
   ```

2. **Test Locally**:
   ```bash
   npm run dev
   ```

3. **Check GitHub Actions**:
   - Go to your repository
   - Click on **Actions** tab
   - Check the latest workflow run

4. **Verify Deployment**:
   - Check your GitHub Pages URL
   - Open browser developer tools
   - Look for any console errors

## Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file** to your repository:
   ```
   yourdomain.com
   ```

2. **Configure DNS**:
   - Add CNAME record pointing to `yourusername.github.io`

3. **Update GitHub Pages settings**:
   - Go to repository settings
   - Add your custom domain

## Security Considerations

1. **API Keys**: Never commit API keys to your repository
2. **Environment Variables**: Use deployment platform's environment variable system
3. **CORS**: Configure CORS properly for your backend
4. **Rate Limiting**: Implement rate limiting on your backend

## Performance Optimization

1. **Enable Gzip compression** on your backend
2. **Use CDN** for static assets
3. **Optimize images** and assets
4. **Enable caching** headers

## Monitoring

1. **Set up logging** on your backend
2. **Monitor API usage** and costs
3. **Set up alerts** for errors
4. **Track performance** metrics

---

**Note**: The frontend will work without a backend for demo purposes, but full AI functionality requires a deployed backend with valid API keys. 