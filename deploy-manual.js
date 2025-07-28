#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting manual deployment...');

try {
  // Clean previous build
  if (existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the project
  console.log('🔨 Building project...');
  execSync('npm run build:client', { stdio: 'inherit' });

  // Check if build was successful
  if (!existsSync('dist/public/index.html')) {
    throw new Error('Build failed - index.html not found');
  }

  console.log('✅ Build successful!');
  console.log('📁 Build contents:');
  execSync('ls -la dist/public', { stdio: 'inherit' });

  // Deploy to GitHub Pages
  console.log('🚀 Deploying to GitHub Pages...');
  execSync('npm run deploy', { stdio: 'inherit' });

  console.log('🎉 Deployment completed!');
  console.log('🌐 Your site should be available at: https://mmohmedmahmoudd.github.io/Ai-Assistant/');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 