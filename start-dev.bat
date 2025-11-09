@echo off
setlocal enabledelayedexpansion

:: Honda Dealership - Local Development Startup Script (Windows)

echo 🏍️  Honda 3S Dealership - Local Development Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

:: Check Node.js installation
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: !NODE_VERSION!
)

:: Check npm installation
echo 🔍 Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm found: !NPM_VERSION!
)

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
) else (
    echo ✅ Frontend dependencies installed
)

:: Install WebSocket server dependencies
echo 📦 Installing WebSocket server dependencies...
call npm install ws
if %errorlevel% neq 0 (
    echo ❌ Failed to install WebSocket server dependencies
    pause
    exit /b 1
) else (
    echo ✅ WebSocket server dependencies installed
)

:: Create local environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating local environment file...
    (
        echo # Honda Dealership - Local Development Environment
        echo.
        echo # WebSocket Configuration
        echo NEXT_PUBLIC_WS_URL=ws://localhost:8081
        echo NEXT_PUBLIC_WS_PORT=8081
        echo.
        echo # Development Settings
        echo NEXT_PUBLIC_ENABLE_REAL_TIME=true
        echo NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=60
        echo NEXT_PUBLIC_MAX_CONNECTIONS=100
        echo.
        echo # Security (Development^)
        echo NEXT_PUBLIC_ENABLE_ENCRYPTION=false
        echo NEXT_PUBLIC_ENABLE_SIGNATURE_VALIDATION=false
        echo NEXT_PUBLIC_AUTH_ENABLED=false
        echo.
        echo # WebSocket Server Settings
        echo RATE_LIMIT_PER_MINUTE=60
        echo MAX_CONNECTIONS=100
        echo ENABLE_RATE_LIMITING=false
        echo ENABLE_AUTH=false
        echo ALLOWED_ORIGINS=http://localhost:3000
        echo.
        echo # Performance
        echo NEXT_PUBLIC_CACHE_DURATION=300000
        echo NEXT_PUBLIC_HEARTBEAT_INTERVAL=30000
    ) > .env.local
    echo ✅ Local environment file created (.env.local^)
) else (
    echo ✅ Local environment file already exists
)

echo.
echo 🚀 Ready to start development servers?
set /p "start_services=Start Honda dealership services? (y/N): "

if /i "!start_services!"=="y" (
    echo.
    echo 🚀 Starting Honda dealership services...
    echo.
    
    :: Start WebSocket server in background
    echo 📡 Starting WebSocket server on port 8081...
    start /b cmd /c "node websocket-server.js"
    timeout /t 2 /nobreak >nul
    echo ✅ WebSocket server started
    
    :: Start Next.js development server
    echo 🌐 Starting Next.js frontend on port 3000...
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo 🎉 Honda 3S Dealership is now running!
    echo.
    echo 📱 Frontend: http://localhost:3000
    echo 🛠️  Admin Panel: http://localhost:3000/admin/inventory  
    echo 📡 WebSocket: ws://localhost:8081
    echo 📊 WebSocket Health: http://localhost:8081/health
    echo.
    echo 💡 Tips:
    echo    • Open admin panel to manage inventory
    echo    • Changes will sync in real-time across tabs
    echo    • Close this window to stop all services
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    
    :: Start Next.js (this will block until user closes)
    call npm run dev
) else (
    echo.
    echo ℹ️  Services not started. To start manually:
    echo    1. Start WebSocket server: node websocket-server.js
    echo    2. Start frontend: npm run dev
    echo.
    echo ✅ Setup complete! Ready for development.
    pause
)