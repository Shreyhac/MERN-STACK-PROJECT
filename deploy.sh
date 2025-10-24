#!/bin/bash

echo "🚀 Deploying MERN Stack Project to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd frontend

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel first:"
    echo "Run: vercel login"
    echo "Then run this script again"
    exit 1
fi

# Deploy to Vercel
echo "Deploying frontend to Vercel..."
vercel --prod --yes

echo "✅ Deployment complete!"
echo "Your app should be available at the URL provided above."
