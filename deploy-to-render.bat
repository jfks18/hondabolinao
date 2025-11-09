@echo off
setlocal enabledelayedexpansion

:: Honda Dealership - Render Deployment Helper Script (Windows)

echo 🏍️  Honda 3S Dealership - Render Deployment Helper
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

:: Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    echo ✅ Git initialized
)

:: Check if remote exists
git remote >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Please add your GitHub repository URL:
    set /p "repo_url=Enter GitHub repo URL (https://github.com/username/repo.git): "
    git remote add origin "!repo_url!"
    echo ✅ Remote added
)

:: Add and commit all changes
echo 📦 Preparing files for deployment...
git add .

:: Check if there are changes to commit
git diff --staged --quiet >nul 2>&1
if %errorlevel% equ 0 (
    echo ℹ️  No changes to commit
) else (
    echo 💾 Committing changes...
    git commit -m "Deploy Honda dealership to Render - %date% %time%"
    echo ✅ Changes committed
)

:: Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main
if %errorlevel% equ 0 (
    echo ✅ Code pushed to GitHub
) else (
    echo ❌ Failed to push to GitHub. Please check your repository URL and credentials.
    pause
    exit /b 1
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 Code is ready for Render deployment!
echo.
echo 📋 Next Steps:
echo.
echo 1. 🌐 Go to https://render.com and login with GitHub
echo 2. 📁 Click 'New +' → 'Web Service'
echo 3. 🔗 Connect your GitHub repository
echo.
echo 🛠️  Deploy in this order:
echo    A^) WebSocket Server first
echo    B^) Frontend second
echo.
echo 📖 Detailed instructions:
echo    • See RENDER_DEPLOYMENT.md for step-by-step guide
echo    • Use render.yaml for automatic configuration
echo.
echo 🔑 Important Environment Variables:
echo.
echo WebSocket Server:
echo    NODE_ENV=production
echo    RATE_LIMIT_PER_MINUTE=60
echo    MAX_CONNECTIONS=100
echo    ENABLE_RATE_LIMITING=true
echo    ALLOWED_ORIGINS=https://your-frontend.onrender.com
echo.
echo Frontend:
echo    NODE_ENV=production
echo    NEXT_PUBLIC_WS_URL=wss://your-websocket.onrender.com
echo    NEXT_PUBLIC_ENABLE_REAL_TIME=true
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 💡 Pro Tips:
echo    • Deploy WebSocket server first to get its URL
echo    • Use the WebSocket URL in frontend's NEXT_PUBLIC_WS_URL
echo    • Update WebSocket's ALLOWED_ORIGINS with frontend URL
echo    • Test both /health endpoints after deployment
echo.
echo 🔗 Quick Links:
echo    • Render Dashboard: https://dashboard.render.com
echo    • Deployment Guide: .\RENDER_DEPLOYMENT.md
echo.
echo Ready to deploy! 🚀
pause