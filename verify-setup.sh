#!/bin/bash

# AI Chatbot Setup Verification Script
# This script verifies that all necessary files are in place

echo "======================================"
echo "AI Chatbot Setup Verification"
echo "======================================"
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    echo "✓ Node.js found: $(node --version)"
else
    echo "✗ Node.js not found. Please install Node.js"
    exit 1
fi

echo ""
echo "Checking project structure..."

# Frontend files
files=(
    "src/App.js"
    "src/index.js"
    "src/index.css"
    "src/components/ChatWindow.js"
    "src/components/ChatInput.js"
    "public/index.html"
    "package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file - MISSING"
    fi
done

echo ""
echo "Checking backend structure..."

# Backend files
backend_files=(
    "backend/server.js"
    "backend/package.json"
    "backend/.env"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file - MISSING"
    fi
done

echo ""
echo "Checking dependencies..."

# Check if node_modules exist
if [ -d "node_modules" ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "✗ Frontend dependencies NOT installed"
    echo "  Run: npm install"
fi

if [ -d "backend/node_modules" ]; then
    echo "✓ Backend dependencies installed"
else
    echo "✗ Backend dependencies NOT installed"
    echo "  Run: cd backend && npm install"
fi

echo ""
echo "======================================"
echo "Verification Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Make sure GROQ_API_KEY is set in backend/.env"
echo "2. Start backend: cd backend && npm start"
echo "3. Start frontend: npm start"
echo ""
