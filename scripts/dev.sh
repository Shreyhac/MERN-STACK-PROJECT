#!/bin/bash

# Web to MCP - Development Server Script

set -e

echo "🚀 Starting Web to MCP development servers..."

# Check if all services are configured
if [ ! -f apps/backend/.env ]; then
    echo "❌ Backend environment file not found. Please run ./scripts/setup.sh first."
    exit 1
fi

# Start all services concurrently
echo "Starting backend, frontend, and extension development servers..."
echo ""
echo "Services will be available at:"
echo "- Backend API: http://localhost:8000"
echo "- Frontend: http://localhost:5173"
echo "- Extension: Load from apps/extension/dist in Chrome"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Use concurrently to start all services
npx concurrently \
  --names "backend,frontend,extension" \
  --prefix-colors "blue,green,yellow" \
  "cd apps/backend && uv run python manage.py runserver" \
  "cd apps/frontend && npm run dev" \
  "cd apps/extension && npm run dev"
