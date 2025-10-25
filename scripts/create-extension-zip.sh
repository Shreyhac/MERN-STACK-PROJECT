#!/bin/bash

# Web to MCP - Extension ZIP Creator
# This script creates a downloadable ZIP file of the extension

set -e

echo "📦 Creating Web to MCP Extension ZIP"
echo "===================================="

# Check if we're in the right directory
if [ ! -d "apps/extension" ]; then
    echo "❌ Error: apps/extension directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Navigate to extension directory
cd apps/extension

# Build the extension if not already built
if [ ! -d ".output/chrome-mv3" ]; then
    echo "🔨 Building extension..."
    npm run build
fi

# Create ZIP file
echo "📦 Creating ZIP file..."
cd .output
zip -r ../../web-to-mcp-extension.zip chrome-mv3/
cd ../..

echo "✅ Extension ZIP created successfully!"
echo ""
echo "📂 ZIP file location: web-to-mcp-extension.zip"
echo "📁 Extension contents: apps/extension/.output/chrome-mv3/"
echo ""
echo "📋 Installation Instructions:"
echo "1. Download the ZIP file"
echo "2. Extract the ZIP file on your computer"
echo "3. Open Chrome and go to chrome://extensions/"
echo "4. Enable 'Developer mode' (toggle in top right)"
echo "5. Click 'Load unpacked'"
echo "6. Select the extracted 'chrome-mv3' folder"
echo "7. The extension will appear in your Chrome toolbar!"
echo ""
echo "🎯 Extension Features:"
echo "- Component Capture: Select and capture website elements"
echo "- Full Page Capture: Capture entire webpage screenshots"
echo "- AI Integration: Send captures to AI coding assistants"
echo "- Terminal UI: Geeky terminal-style interface"
echo ""
echo "🔗 Test the extension on any website!"
