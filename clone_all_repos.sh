#!/bin/bash

# Script to clone all Web-to-MCP repositories
echo "Starting to clone all Web-to-MCP repositories..."

# Clone backend repository
echo "Cloning backend repository..."
git clone https://github.com/Web-to-MCP/backend.git

# Clone frontend repository
echo "Cloning frontend repository..."
git clone https://github.com/Web-to-MCP/frontend.git

# Clone extension repository
echo "Cloning extension repository..."
git clone https://github.com/Web-to-MCP/extension.git

echo "All repositories cloned successfully!"
echo "Repository structure:"
echo "- backend/"
echo "- frontend/"
echo "- extension/"
