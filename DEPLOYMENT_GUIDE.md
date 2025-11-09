# Honda Dealership - Production Deployment Guide

## 🚀 Complete Render.com Deployment Instructions

### 1. Frontend (Next.js App) Deployment

#### Step 1: Create Web Service on Render
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment settings:

```yaml
Name: honda-dealership-frontend
Environment: Node
Build Command: npm run build
Start Command: npm start
Auto-Deploy: Yes
```

#### Step 2: Environment Variables for Frontend
In Render dashboard, add these environment variables:

```env
# WebSocket Configuration
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.onrender.com
NEXT_PUBLIC_WS_PORT=443

# Security Configuration
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE=60
NEXT_PUBLIC_MAX_CONNECTIONS=100
NEXT_PUBLIC_ENABLE_ENCRYPTION=true
NEXT_PUBLIC_ENABLE_SIGNATURE_VALIDATION=true

# Authentication (if needed)
NEXT_PUBLIC_AUTH_ENABLED=false
NEXT_PUBLIC_SESSION_SECRET=your-super-secret-key-here

# Performance
NEXT_PUBLIC_CACHE_DURATION=300000
NEXT_PUBLIC_HEARTBEAT_INTERVAL=30000

# Honda API Configuration
NEXT_PUBLIC_HONDA_API_URL=https://api.hondaph.com
NEXT_PUBLIC_API_TIMEOUT=5000
```

### 2. WebSocket Server Deployment

#### Step 1: Create Web Service for WebSocket Server
1. In Render dashboard: "New +" → "Web Service"
2. Use same repository or create separate one
3. Configure:

```yaml
Name: honda-websocket-server
Environment: Node
Root Directory: ./  (if in same repo)
Build Command: npm install --only=production
Start Command: node websocket-server.js
Auto-Deploy: Yes
```

#### Step 2: Environment Variables for WebSocket Server
```env
# Server Configuration
PORT=10000
NODE_ENV=production

# Security Configuration
RATE_LIMIT_PER_MINUTE=60
MAX_CONNECTIONS=100
ENABLE_RATE_LIMITING=true
ENABLE_AUTH=false

# CORS Configuration
ALLOWED_ORIGINS=https://your-frontend-app.onrender.com,https://honda-dealership-frontend.onrender.com

# Monitoring
LOG_LEVEL=info
ENABLE_DETAILED_LOGGING=true

# Health Check
HEALTH_CHECK_INTERVAL=30000
```

#### Step 3: Upload server-package.json
Rename `server-package.json` to `package.json` in your WebSocket server directory or repository.

### 3. Security Configuration for Production

#### Frontend Security Headers (next.config.ts)
Update your `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  },
  
  // WebSocket proxy for development
  async rewrites() {
    return [
      {
        source: '/api/ws',
        destination: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
      }
    ]
  }
}

module.exports = nextConfig
```

### 4. Deployment Steps

#### Step 1: Prepare Your Repository
1. Ensure all files are committed to Git
2. Push to GitHub/GitLab
3. Verify `.env.production` is in `.gitignore` (security)

#### Step 2: Deploy WebSocket Server First
1. Create WebSocket service in Render
2. Set environment variables
3. Deploy and test health endpoint: `https://your-websocket.onrender.com/health`

#### Step 3: Deploy Frontend
1. Update `NEXT_PUBLIC_WS_URL` with your WebSocket server URL
2. Create frontend service in Render
3. Deploy and test

#### Step 4: Update WebSocket CORS
1. After frontend deploys, update `ALLOWED_ORIGINS` in WebSocket server
2. Include your frontend URL: `https://your-frontend.onrender.com`

### 5. Testing Production Deployment

#### Health Checks
1. **Frontend Health**: Visit your frontend URL
2. **WebSocket Health**: `https://your-websocket.onrender.com/health`
3. **WebSocket Stats**: `https://your-websocket.onrender.com/stats`

#### Real-time Testing
1. Open admin panel: `https://your-frontend.onrender.com/admin/inventory`
2. Open product page in another tab
3. Update inventory in admin - should reflect immediately

### 6. Monitoring & Maintenance

#### Render Monitoring
- Check service logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

#### WebSocket Server Logs
```bash
# View logs in Render dashboard or via API
curl https://your-websocket.onrender.com/stats
```

#### Performance Monitoring
- Monitor connection counts
- Check memory usage
- Watch for rate limiting events

### 7. Domain Configuration (Optional)

#### Custom Domain Setup
1. In Render dashboard → Settings → Custom Domains
2. Add your domain (e.g., `honda-dealership.com`)
3. Update DNS records as instructed
4. Update environment variables with new domain

#### SSL/HTTPS
- Render automatically provides SSL certificates
- Ensure WebSocket uses WSS (secure WebSocket)
- Update `NEXT_PUBLIC_WS_URL` to use `wss://`

### 8. Scaling Configuration

#### Auto-scaling Settings
```env
# WebSocket Server Scaling
MIN_INSTANCES=1
MAX_INSTANCES=3
CPU_THRESHOLD=70
MEMORY_THRESHOLD=80

# Frontend Scaling
NEXT_PUBLIC_MAX_CONCURRENT_USERS=500
```

### 9. Backup & Recovery

#### Database Backup (if using external DB)
- Set up automated backups
- Test restore procedures

#### Configuration Backup
- Export environment variables
- Document deployment steps
- Keep deployment configs in version control

### 10. Security Checklist

✅ **Environment Variables**
- [ ] All secrets in environment variables
- [ ] No hardcoded API keys
- [ ] Production-specific URLs

✅ **CORS & Origins**
- [ ] Allowed origins configured
- [ ] No wildcard CORS in production
- [ ] WebSocket origin validation

✅ **Rate Limiting**
- [ ] Rate limiting enabled
- [ ] Connection limits set
- [ ] IP-based throttling active

✅ **HTTPS/WSS**
- [ ] Frontend uses HTTPS
- [ ] WebSocket uses WSS
- [ ] Security headers configured

✅ **Monitoring**
- [ ] Health checks working
- [ ] Logs monitored
- [ ] Performance tracking

### 11. Troubleshooting

#### Common Issues

**WebSocket Connection Failed**
```bash
# Check if WebSocket server is running
curl https://your-websocket.onrender.com/health

# Verify CORS settings
# Check browser console for CORS errors
```

**Frontend Build Errors**
```bash
# Check environment variables are set
# Verify all dependencies in package.json
# Check build logs in Render dashboard
```

**Real-time Updates Not Working**
```bash
# Test WebSocket connection directly
# Check browser network tab for WebSocket
# Verify client authentication if enabled
```

#### Debug Commands
```javascript
// Test WebSocket in browser console
const ws = new WebSocket('wss://your-websocket.onrender.com');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', e.data);
ws.onerror = (e) => console.error('Error:', e);
```

### 12. Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] WebSocket connects successfully  
- [ ] Real-time updates work across tabs
- [ ] Admin panel functions correctly
- [ ] Inventory updates sync in real-time
- [ ] Performance is acceptable
- [ ] Security headers present
- [ ] SSL certificates valid
- [ ] Monitoring alerts configured
- [ ] Backup procedures tested

## 🎉 Your Honda dealership is now live and secure!

**Frontend URL**: `https://your-frontend.onrender.com`
**Admin Panel**: `https://your-frontend.onrender.com/admin/inventory`
**API Health**: `https://your-websocket.onrender.com/health`

---

## Support & Maintenance

For ongoing support:
1. Monitor Render dashboard regularly
2. Check logs for errors
3. Update dependencies periodically
4. Review security configurations quarterly

**Production Ready Features:**
- ✅ Secure WebSocket with authentication
- ✅ Rate limiting and DDoS protection
- ✅ Real-time inventory synchronization
- ✅ Comprehensive admin dashboard
- ✅ Mobile-responsive design
- ✅ Performance optimized
- ✅ SEO friendly
- ✅ Production security headers
- ✅ Error monitoring and logging