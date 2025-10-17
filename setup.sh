#!/bin/bash

# VE E-Commerce Platform - Quick Start Script

echo "🚀 VE E-Commerce Platform - Setup & Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 14.0.0"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend dependencies already installed"
fi
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1️⃣  Start the backend server:"
echo "   cd server && npm run dev"
echo "   Server will run on http://localhost:3000"
echo ""
echo "2️⃣  Start the frontend (in a new terminal):"
echo "   cd client"
echo "   npx serve . --listen 8080"
echo "   # or: python3 -m http.server 8080"
echo "   Frontend will be available at http://localhost:8080"
echo ""
echo "3️⃣  Open your browser and visit:"
echo "   http://localhost:8080/index.html"
echo ""
echo "📚 For more information, see FULLSTACK_README.md"
echo ""
