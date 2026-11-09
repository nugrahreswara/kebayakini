#!/bin/bash

# Kebayaku Startup Script
# This script helps you quickly start the development or production environment

set -e

echo "🌸 Kebayaku - Luxury Kebaya Rental Platform"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        return 1
    fi
    return 0
}

# Main menu
echo "Select an option:"
echo "1) Install dependencies"
echo "2) Run development server"
echo "3) Build for production"
echo "4) Start production server"
echo "5) Run with Docker"
echo "6) Clean install (remove node_modules and reinstall)"
echo "7) Exit"
echo ""
read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing dependencies..."
        npm install
        echo ""
        echo "✅ Dependencies installed successfully!"
        ;;
    2)
        echo ""
        if ! check_dependencies; then
            echo "⚠️  Dependencies not found. Installing..."
            npm install
            echo ""
        fi
        echo "🚀 Starting development server..."
        echo "📍 Open http://localhost:3000 in your browser"
        echo ""
        npm run dev
        ;;
    3)
        echo ""
        if ! check_dependencies; then
            echo "⚠️  Dependencies not found. Installing..."
            npm install
            echo ""
        fi
        echo "🔨 Building for production..."
        npm run build
        echo ""
        echo "✅ Build completed successfully!"
        ;;
    4)
        echo ""
        if [ ! -d ".next" ]; then
            echo "❌ Build not found. Please build the project first (option 3)"
            exit 1
        fi
        echo "🚀 Starting production server..."
        echo "📍 Open http://localhost:3000 in your browser"
        echo ""
        npm run start
        ;;
    5)
        echo ""
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed. Please install Docker first."
            exit 1
        fi
        echo "🐳 Building and starting Docker container..."
        docker-compose up --build -d
        echo ""
        echo "✅ Container started successfully!"
        echo "📍 Open http://localhost:3000 in your browser"
        echo ""
        echo "To view logs: docker-compose logs -f"
        echo "To stop: docker-compose down"
        ;;
    6)
        echo ""
        echo "🧹 Cleaning node_modules..."
        rm -rf node_modules package-lock.json
        echo "📦 Installing dependencies..."
        npm install
        echo ""
        echo "✅ Clean install completed!"
        ;;
    7)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "==========================================="
echo "✨ Thank you for using Kebayaku!"
