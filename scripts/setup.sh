#!/bin/bash

# Web to MCP - Development Setup Script

set -e

echo "🚀 Setting up Web to MCP development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20.19.0 or higher."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.10 or higher."
    exit 1
fi

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Please install uv: https://github.com/astral-sh/uv"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd apps/frontend
npm install
cd ../..

# Install extension dependencies
echo "📦 Installing extension dependencies..."
cd apps/extension
npm install
cd ../..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd apps/backend
uv sync
cd ../..

# Copy environment files
echo "⚙️ Setting up environment files..."
if [ ! -f apps/backend/.env ]; then
    cp apps/backend/env.example apps/backend/.env
    echo "📝 Created apps/backend/.env - please configure your database and OAuth settings"
fi

if [ ! -f apps/extension/.env ]; then
    echo "BACKEND_URL=http://localhost:8000" > apps/extension/.env
    echo "NODE_ENV=development" >> apps/extension/.env
    echo "📝 Created apps/extension/.env"
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your database and OAuth settings in apps/backend/.env"
echo "2. Run database migrations: cd apps/backend && uv run python manage.py migrate"
echo "3. Create a superuser: cd apps/backend && uv run python manage.py createsuperuser"
echo "4. Start development servers: npm run dev"
echo ""
echo "The application will be available at:"
echo "- Backend API: http://localhost:8000"
echo "- Frontend: http://localhost:5173"
echo "- Extension: Load from apps/extension/dist in Chrome"
