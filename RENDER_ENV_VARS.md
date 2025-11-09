# 🔧 Render Environment Variables Template

## Copy and paste these during deployment setup

### 🔌 WebSocket Server Environment Variables
```
NODE_ENV=production
RATE_LIMIT_PER_MINUTE=60
MAX_CONNECTIONS=100
ENABLE_RATE_LIMITING=true
ENABLE_AUTH=false
ALLOWED_ORIGINS=https://honda-dealership-frontend.onrender.com
```

### 🌐 Frontend Environment Variables  
```
NODE_ENV=production
NEXT_PUBLIC_WS_URL=wss://honda-websocket-server.onrender.com
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=60
NEXT_PUBLIC_MAX_CONNECTIONS=100
NEXT_PUBLIC_ENABLE_ENCRYPTION=false
NEXT_PUBLIC_ENABLE_SIGNATURE_VALIDATION=false
NEXT_PUBLIC_AUTH_ENABLED=false
NEXT_PUBLIC_CACHE_DURATION=300000
NEXT_PUBLIC_HEARTBEAT_INTERVAL=30000
```

### 📝 Service Configuration for Render

#### WebSocket Server Service:
- **Name**: `honda-websocket-server`
- **Environment**: Node
- **Build Command**: `npm install ws`
- **Start Command**: `node websocket-server.js`
- **Health Check Path**: `/health`

#### Frontend Service:
- **Name**: `honda-dealership-frontend` 
- **Environment**: Node
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 🔄 Update After Deployment

1. **After WebSocket deploys**, update Frontend's:
   ```
   NEXT_PUBLIC_WS_URL=wss://[your-websocket-url].onrender.com
   ```

2. **After Frontend deploys**, update WebSocket's:
   ```
   ALLOWED_ORIGINS=https://[your-frontend-url].onrender.com
   ```

### 🎯 Expected URLs After Deployment
- **Frontend**: `https://honda-dealership-frontend.onrender.com`
- **Admin**: `https://honda-dealership-frontend.onrender.com/admin/inventory`
- **WebSocket Health**: `https://honda-websocket-server.onrender.com/health`
- **WebSocket Stats**: `https://honda-websocket-server.onrender.com/stats`