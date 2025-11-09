#!/bin/bash

# Honda Dealership - Local Development Startup Script

echo "🏍️  Honda 3S Dealership - Local Development Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js installation
echo -e "${BLUE}🔍 Checking Node.js installation...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

# Check npm installation
echo -e "${BLUE}🔍 Checking npm installation...${NC}"
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

# Install frontend dependencies
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

# Install WebSocket server dependencies
echo -e "${BLUE}📦 Installing WebSocket server dependencies...${NC}"
if npm install ws; then
    echo -e "${GREEN}✅ WebSocket server dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install WebSocket server dependencies${NC}"
    exit 1
fi

# Create local environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}📝 Creating local environment file...${NC}"
    cat > .env.local << EOL
# Honda Dealership - Local Development Environment

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:8081
NEXT_PUBLIC_WS_PORT=8081

# Development Settings
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=60
NEXT_PUBLIC_MAX_CONNECTIONS=100

# Security (Development)
NEXT_PUBLIC_ENABLE_ENCRYPTION=false
NEXT_PUBLIC_ENABLE_SIGNATURE_VALIDATION=false
NEXT_PUBLIC_AUTH_ENABLED=false

# WebSocket Server Settings
RATE_LIMIT_PER_MINUTE=60
MAX_CONNECTIONS=100
ENABLE_RATE_LIMITING=false
ENABLE_AUTH=false
ALLOWED_ORIGINS=http://localhost:3000

# Performance
NEXT_PUBLIC_CACHE_DURATION=300000
NEXT_PUBLIC_HEARTBEAT_INTERVAL=30000
EOL
    echo -e "${GREEN}✅ Local environment file created (.env.local)${NC}"
else
    echo -e "${GREEN}✅ Local environment file already exists${NC}"
fi

# Function to start services
start_services() {
    echo -e "${BLUE}🚀 Starting Honda dealership services...${NC}"
    echo ""

    # Start WebSocket server in background
    echo -e "${BLUE}📡 Starting WebSocket server on port 8081...${NC}"
    node websocket-server.js &
    WS_PID=$!
    echo -e "${GREEN}✅ WebSocket server started (PID: $WS_PID)${NC}"
    
    # Wait a moment for WebSocket server to start
    sleep 2
    
    # Start Next.js development server
    echo -e "${BLUE}🌐 Starting Next.js frontend on port 3000...${NC}"
    npm run dev &
    NEXT_PID=$!
    echo -e "${GREEN}✅ Next.js frontend started (PID: $NEXT_PID)${NC}"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🎉 Honda 3S Dealership is now running!${NC}"
    echo ""
    echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
    echo -e "${BLUE}🛠️  Admin Panel:${NC} http://localhost:3000/admin/inventory"
    echo -e "${BLUE}📡 WebSocket:${NC} ws://localhost:8081"
    echo -e "${BLUE}📊 WebSocket Health:${NC} http://localhost:8081/health"
    echo ""
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo "   • Open admin panel to manage inventory"
    echo "   • Changes will sync in real-time across tabs"
    echo "   • Press Ctrl+C to stop all services"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Create cleanup function
    cleanup() {
        echo ""
        echo -e "${YELLOW}🛑 Shutting down services...${NC}"
        kill $WS_PID 2>/dev/null || true
        kill $NEXT_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Services stopped${NC}"
        exit 0
    }
    
    # Set trap for cleanup on Ctrl+C
    trap cleanup SIGINT SIGTERM
    
    # Wait for processes
    wait
}

# Ask user if they want to start services
echo ""
echo -e "${YELLOW}🚀 Ready to start development servers?${NC}"
read -p "Start Honda dealership services? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    start_services
else
    echo -e "${BLUE}ℹ️  Services not started. To start manually:${NC}"
    echo "   1. Start WebSocket server: node websocket-server.js"
    echo "   2. Start frontend: npm run dev"
    echo ""
    echo -e "${GREEN}✅ Setup complete! Ready for development.${NC}"
fi