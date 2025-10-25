#!/bin/bash

# Web to MCP - Quick Test Script (SQLite version)
# This script starts all services with minimal dependencies

set -e

echo "🚀 Starting Web to MCP - Quick Test Environment"
echo "=============================================="

# Create a simple test configuration
echo "⚙️ Setting up test configuration..."

# Backend test configuration with SQLite
mkdir -p apps/backend
cat > apps/backend/.env << EOF
SECRET_KEY=test-secret-key-for-development-only
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret
STRIPE_SECRET_KEY=sk_test_fake_key_for_testing
STRIPE_WEBHOOK_SECRET=whsec_fake_webhook_secret
STRIPE_SUCCESS_URL=http://localhost:5173/payment-success
STRIPE_CANCEL_URL=http://localhost:5173/payment-failed
EOF

# Extension test configuration
mkdir -p apps/extension
cat > apps/extension/.env << EOF
BACKEND_URL=http://localhost:8000
NODE_ENV=development
EOF

echo "✅ Test configuration created"

# Install minimal backend dependencies
echo "📦 Installing minimal backend dependencies..."
cd apps/backend

# Create a minimal requirements.txt for testing
cat > requirements.txt << EOF
Django>=4.2.7,<5.0
djangorestframework>=3.14.0,<4.0
django-cors-headers>=4.3.1,<5.0
python-decouple>=3.8,<4.0
EOF

# Install with pip instead of uv to avoid MySQL issues
pip3 install -r requirements.txt

cd ../..

# Start all services
echo ""
echo "🚀 Starting all services..."
echo ""
echo "Services will be available at:"
echo "🌐 Frontend (Main Interface): http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "🔌 Extension: Load from apps/extension/dist in Chrome"
echo ""
echo "📋 Testing Instructions:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. The frontend will connect to the backend API"
echo "3. For extension testing, load the extension from apps/extension/dist"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start all services concurrently
npx concurrently \
  --names "backend,frontend,extension" \
  --prefix-colors "blue,green,yellow" \
  --kill-others-on-fail \
  "cd apps/backend && python3 manage.py migrate --run-syncdb && python3 manage.py runserver 0.0.0.0:8000" \
  "cd apps/frontend && npm run dev" \
  "cd apps/extension && npm run build && echo 'Extension built! Load apps/extension/dist in Chrome'"
