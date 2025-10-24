#!/bin/bash

# Web-to-MCP Website Startup Script
echo "🚀 Starting Web-to-MCP Website..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 1
    else
        echo "Port $1 is available"
        return 0
    fi
}

# Start Frontend (React)
echo "📱 Starting Frontend (React) on port 5174..."
cd /Users/shreyansharora/mernf/frontend
if check_port 5174; then
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
else
    echo "Frontend port 5174 is already in use. Please stop the existing process."
fi

# Start Backend (Django) - Note: Backend requires database setup
echo "🔧 Backend (Django) setup required..."
echo "To start the backend, you need to:"
echo "1. Set up MySQL database"
echo "2. Configure environment variables"
echo "3. Run migrations"
echo "4. Start the Django server"
echo ""
echo "Backend would run on: http://localhost:8000"
echo ""

# Display website links
echo "🌐 Website Links:"
echo "Frontend: http://localhost:5174"
echo "Backend API: http://localhost:8000"
echo ""
echo "📋 To start the backend manually:"
echo "cd /Users/shreyansharora/mernf/backend"
echo "uv sync"
echo "uv run python manage.py runserver"
echo ""
echo "🔗 Main Website: http://localhost:5174"
echo "Press Ctrl+C to stop the frontend server"

# Wait for user to stop
wait $FRONTEND_PID
