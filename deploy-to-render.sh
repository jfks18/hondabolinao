#!/bin/bash

# Honda Dealership - Render Deployment Helper Script

echo "🏍️  Honda 3S Dealership - Render Deployment Helper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📝 Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo -e "${YELLOW}🔗 Please add your GitHub repository URL:${NC}"
    read -p "Enter GitHub repo URL (https://github.com/username/repo.git): " repo_url
    git remote add origin "$repo_url"
    echo -e "${GREEN}✅ Remote added${NC}"
fi

# Add and commit all changes
echo -e "${BLUE}📦 Preparing files for deployment...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
else
    echo -e "${BLUE}💾 Committing changes...${NC}"
    git commit -m "Deploy Honda dealership to Render - $(date)"
    echo -e "${GREEN}✅ Changes committed${NC}"
fi

# Push to GitHub
echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
if git push -u origin main; then
    echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub. Please check your repository URL and credentials.${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Code is ready for Render deployment!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. 🌐 Go to https://render.com and login with GitHub"
echo "2. 📁 Click 'New +' → 'Web Service'"
echo "3. 🔗 Connect your GitHub repository"
echo ""
echo -e "${YELLOW}🛠️  Deploy in this order:${NC}"
echo "   A) WebSocket Server first"
echo "   B) Frontend second"
echo ""
echo -e "${BLUE}📖 Detailed instructions:${NC}"
echo "   • See RENDER_DEPLOYMENT.md for step-by-step guide"
echo "   • Use render.yaml for automatic configuration"
echo ""
echo -e "${GREEN}🔑 Important Environment Variables:${NC}"
echo ""
echo -e "${YELLOW}WebSocket Server:${NC}"
echo "   NODE_ENV=production"
echo "   RATE_LIMIT_PER_MINUTE=60"
echo "   MAX_CONNECTIONS=100"
echo "   ENABLE_RATE_LIMITING=true"
echo "   ALLOWED_ORIGINS=https://your-frontend.onrender.com"
echo ""
echo -e "${YELLOW}Frontend:${NC}"
echo "   NODE_ENV=production"
echo "   NEXT_PUBLIC_WS_URL=wss://your-websocket.onrender.com"
echo "   NEXT_PUBLIC_ENABLE_REAL_TIME=true"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}💡 Pro Tips:${NC}"
echo "   • Deploy WebSocket server first to get its URL"
echo "   • Use the WebSocket URL in frontend's NEXT_PUBLIC_WS_URL"
echo "   • Update WebSocket's ALLOWED_ORIGINS with frontend URL"
echo "   • Test both /health endpoints after deployment"
echo ""
echo -e "${BLUE}🔗 Quick Links:${NC}"
echo "   • Render Dashboard: https://dashboard.render.com"
echo "   • Deployment Guide: ./RENDER_DEPLOYMENT.md"
echo "   • GitHub Repo: $(git remote get-url origin)"
echo ""
echo -e "${GREEN}Ready to deploy! 🚀${NC}"