#!/bin/bash

# Web to MCP - Extension Builder Script
# This script builds the extension and prepares it for installation

set -e

echo "🚀 Building Web to MCP Extension"
echo "================================"

# Check if we're in the right directory
if [ ! -d "apps/extension" ]; then
    echo "❌ Error: apps/extension directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Navigate to extension directory
cd apps/extension

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building extension..."
npm run build

echo "✅ Extension built successfully!"
echo ""
echo "📂 Extension location: $(pwd)/dist"
echo ""
echo "📋 Installation Instructions:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'dist' folder from: $(pwd)/dist"
echo "5. The extension will appear in your Chrome toolbar!"
echo ""
echo "🎯 Extension Features:"
echo "- Component Capture: Select and capture website elements"
echo "- Full Page Capture: Capture entire webpage screenshots"
echo "- AI Integration: Send captures to AI coding assistants"
echo "- Terminal UI: Geeky terminal-style interface"
echo ""
echo "🔗 Test the extension on any website!"
