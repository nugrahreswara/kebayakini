#!/bin/bash

# Kebayaku Deployment Script
# Deploys the application to kebayaku.web.id

set -e

echo "🌸 Kebayaku Deployment Script"
echo "================================"
echo ""
echo "Target: kebayaku.web.id"
echo "Date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "Please run this script from the project root directory"
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ is required. Current version: $(node -v)"
fi

success "Node.js $(node -v) detected"

# Main menu
echo ""
echo "Select deployment method:"
echo "1) Test Build (Verify everything works)"
echo "2) Docker Deployment (Local/Server)"
echo "3) Vercel Deployment (Recommended)"
echo "4) Clean & Rebuild"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        info "Running test build..."
        
        # Clean previous build
        rm -rf .next 2>/dev/null || true
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            info "Installing dependencies..."
            npm install
        fi
        
        # Run build
        info "Building application..."
        if npm run build; then
            success "Build successful!"
            echo ""
            info "Next steps:"
            echo "1. Test admin login: npm run dev"
            echo "2. Deploy using option 2 or 3"
        else
            error "Build failed. Check errors above."
        fi
        ;;
    
    2)
        echo ""
        info "Docker Deployment"
        echo "-----------------"
        
        if ! command -v docker &> /dev/null; then
            error "Docker is not installed. Please install Docker first."
        fi
        
        echo "1. Building Docker image..."
        docker build -t kebayaku-app:latest .
        success "Docker image built successfully"
        
        echo ""
        echo "2. Starting container..."
        if command -v docker-compose &> /dev/null; then
            docker-compose up -d
            success "Started with Docker Compose"
            echo ""
            echo "🌍 Application running at: http://localhost:3000"
            echo "📊 View logs: docker-compose logs -f"
            echo "🛑 Stop: docker-compose down"
        else
            docker run -d -p 3000:3000 --name kebayaku kebayaku-app:latest
            success "Started with Docker run"
            echo ""
            echo "🌍 Application running at: http://localhost:3000"
            echo "📊 View logs: docker logs -f kebayaku"
            echo "🛑 Stop: docker stop kebayaku && docker rm kebayaku"
        fi
        
        echo ""
        info "To deploy to production server:"
        echo "1. Copy the entire project to server"
        echo "2. Run: docker-compose up -d"
        echo "3. Configure reverse proxy (nginx/apache)"
        echo "4. Point domain kebayaku.web.id to server IP"
        ;;
    
    3)
        echo ""
        info "Vercel Deployment"
        echo "-----------------"
        
        if ! command -v vercel &> /dev/null; then
            info "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        echo ""
        echo "Select Vercel option:"
        echo "a) Temporary deployment (for testing)"
        echo "b) Production deployment (requires login)"
        echo ""
        read -p "Enter option (a/b): " vercel_choice
        
        case $vercel_choice in
            a)
                info "Creating temporary deployment..."
                vercel deploy --temporary
                success "Deployment created!"
                ;;
            b)
                info "Creating production deployment..."
                echo ""
                info "Note: You need to be logged in to Vercel"
                echo "If not logged in, run: vercel login"
                echo ""
                read -p "Continue? (y/n): " -n 1 -r
                echo ""
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    vercel --prod
                    success "Production deployment complete!"
                    echo ""
                    info "To add custom domain:"
                    echo "vercel domains add kebayaku.web.id"
                fi
                ;;
            *)
                error "Invalid option"
                ;;
        esac
        ;;
    
    4)
        echo ""
        info "Cleaning and rebuilding..."
        
        echo "1. Removing node_modules and build artifacts..."
        rm -rf node_modules .next package-lock.json 2>/dev/null || true
        
        echo "2. Installing dependencies..."
        npm install
        
        echo "3. Building application..."
        if npm run build; then
            success "Clean rebuild successful!"
            echo ""
            info "Application ready for deployment"
        else
            error "Build failed"
        fi
        ;;
    
    5)
        echo ""
        info "Exiting..."
        exit 0
        ;;
    
    *)
        error "Invalid option"
        ;;
esac

echo ""
echo "================================"
success "Deployment script completed!"
echo ""
echo "For more information, see:"
echo "- DEPLOYMENT_GUIDE.md"
echo "- README.md"
echo ""
echo "✨ Good luck with kebayaku.web.id! ✨"