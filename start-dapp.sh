#!/bin/bash

# Navigate to the correct project directory
cd /Users/arashsarabian/Desktop/NexusWealthVGit

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please check the directory."
    exit 1
fi

echo "Starting NexusWealth Web3 DApp..."
echo "Directory: $(pwd)"
echo "Package.json: $(cat package.json | grep '"name"' | head -1)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting development server on localhost:3000..."
npm run dev
