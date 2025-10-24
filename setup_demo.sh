#!/bin/bash

# Web-to-MCP Demo Setup Script
echo "🚀 Setting up Web-to-MCP Demo for College Submission..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20.19.0+"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.10+"
        exit 1
    fi
    
    if ! command -v uv &> /dev/null; then
        print_warning "uv package manager not found. Installing uv..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        source $HOME/.cargo/env
    fi
    
    print_success "All requirements met!"
}

# Setup Frontend
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        if [ $? -eq 0 ]; then
            print_success "Frontend dependencies installed!"
        else
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    else
        print_success "Frontend dependencies already installed!"
    fi
    
    cd ..
}

# Setup Backend
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cp env.example .env
        print_warning "Please edit backend/.env with your database and OAuth settings"
    fi
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    uv sync
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed!"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    cd ..
}

# Setup Extension
setup_extension() {
    print_status "Setting up Chrome extension..."
    cd extension
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing extension dependencies..."
        npm install
        if [ $? -eq 0 ]; then
            print_success "Extension dependencies installed!"
        else
            print_error "Failed to install extension dependencies"
            exit 1
        fi
    else
        print_success "Extension dependencies already installed!"
    fi
    
    cd ..
}

# Build Extension
build_extension() {
    print_status "Building Chrome extension..."
    cd extension
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Extension built successfully!"
        print_status "Extension build location: extension/dist/"
    else
        print_error "Failed to build extension"
        exit 1
    fi
    cd ..
}

# Create startup script
create_startup_script() {
    print_status "Creating startup script..."
    cat > start_demo.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Web-to-MCP Demo..."

# Start Frontend
echo "📱 Starting Frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo "🌐 Frontend: http://localhost:5174"
echo "📋 To start backend manually:"
echo "   cd backend && uv run python manage.py runserver"
echo ""
echo "🔧 Extension installation:"
echo "   1. Open chrome://extensions/"
echo "   2. Enable Developer mode"
echo "   3. Click 'Load unpacked'"
echo "   4. Select the 'extension/dist' folder"
echo ""
echo "Press Ctrl+C to stop the frontend server"

# Wait for user to stop
wait $FRONTEND_PID
EOF
    chmod +x start_demo.sh
    print_success "Startup script created: ./start_demo.sh"
}

# Main setup process
main() {
    echo "🎓 Web-to-MCP College Project Setup"
    echo "====================================="
    echo ""
    
    check_requirements
    setup_frontend
    setup_backend
    setup_extension
    build_extension
    create_startup_script
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "📋 Next Steps:"
    echo "1. Edit backend/.env with your database settings"
    echo "2. Run: ./start_demo.sh"
    echo "3. Install the Chrome extension from extension/dist/"
    echo ""
    echo "🌐 Website: http://localhost:5174"
    echo "🔧 Backend: http://localhost:8000 (run manually)"
    echo ""
    print_success "Demo is ready for college submission!"
}

# Run main function
main
