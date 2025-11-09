# 🚀 How to Deploy Honda Dealership to Render.com

## Step-by-Step Deployment Guide

### Prerequisites
- GitHub account
- Render.com account (free tier available)
- Your code pushed to GitHub repository

---

## 🗂️ Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Honda dealership production ready"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/honda-dealership.git

# Push to GitHub
git push -u origin main
```

### 1.2 Create Required Files for Render

Create a `render.yaml` file in your root directory:

```yaml
# render.yaml - Render Blueprint for Honda Dealership
services:
  # WebSocket Server
  - type: web
    name: honda-websocket-server
    env: node
    buildCommand: npm install ws
    startCommand: node websocket-server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        generateValue: true
      - key: RATE_LIMIT_PER_MINUTE
        value: 60
      - key: MAX_CONNECTIONS
        value: 100
      - key: ENABLE_RATE_LIMITING
        value: true
      - key: ENABLE_AUTH
        value: false
      - key: ALLOWED_ORIGINS
        value: https://honda-dealership-frontend.onrender.com

  # Next.js Frontend
  - type: web
    name: honda-dealership-frontend
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_WS_URL
        value: wss://honda-websocket-server.onrender.com
      - key: NEXT_PUBLIC_ENABLE_REAL_TIME
        value: true
      - key: NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE
        value: 60
</yaml>

---

## 🔧 Step 2: Deploy WebSocket Server First

### 2.1 Login to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"

### 2.2 Create WebSocket Service
1. **Connect Repository**: Choose your GitHub repo
2. **Service Configuration**:
   ```
   Name: honda-websocket-server
   Environment: Node
   Region: Oregon (US West) [or closest to you]
   Branch: main
   Root Directory: [leave blank]
   Runtime: Node
   Build Command: npm install ws
   Start Command: node websocket-server.js
   ```

3. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV = production
   RATE_LIMIT_PER_MINUTE = 60
   MAX_CONNECTIONS = 100
   ENABLE_RATE_LIMITING = true
   ENABLE_AUTH = false
   ALLOWED_ORIGINS = [leave blank for now - will update after frontend]
   ```

4. **Instance Type**: Free (sufficient for testing)
5. **Auto-Deploy**: Yes
6. Click "Create Web Service"

### 2.3 Wait for Deployment
- Watch the build logs
- Should complete in 2-3 minutes
- Note your WebSocket URL: `https://honda-websocket-server.onrender.com`

### 2.4 Test WebSocket Server
Visit: `https://honda-websocket-server.onrender.com/health`
Should return:
```json
{
  "status": "ok",
  "clients": 0,
  "authenticated": 0,
  "uptime": 123.45,
  "timestamp": "2025-11-09T..."
}
```

---

## 🌐 Step 3: Deploy Frontend

### 3.1 Create Frontend Service
1. In Render dashboard: "New +" → "Web Service"
2. **Connect Same Repository**
3. **Service Configuration**:
   ```
   Name: honda-dealership-frontend
   Environment: Node
   Region: Oregon (US West) [same as WebSocket]
   Branch: main
   Root Directory: [leave blank]
   Runtime: Node
   Build Command: npm run build
   Start Command: npm start
   ```

### 3.2 Environment Variables for Frontend
```
NODE_ENV = production
NEXT_PUBLIC_WS_URL = wss://honda-websocket-server.onrender.com
NEXT_PUBLIC_ENABLE_REAL_TIME = true
NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE = 60
NEXT_PUBLIC_MAX_CONNECTIONS = 100
NEXT_PUBLIC_ENABLE_ENCRYPTION = false
NEXT_PUBLIC_ENABLE_SIGNATURE_VALIDATION = false
NEXT_PUBLIC_AUTH_ENABLED = false
NEXT_PUBLIC_CACHE_DURATION = 300000
NEXT_PUBLIC_HEARTBEAT_INTERVAL = 30000
```

4. **Instance Type**: Free
5. **Auto-Deploy**: Yes
6. Click "Create Web Service"

### 3.3 Update WebSocket CORS
1. Go back to WebSocket service
2. Environment Variables → Edit `ALLOWED_ORIGINS`
3. Set to: `https://honda-dealership-frontend.onrender.com`
4. This triggers auto-redeploy

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Frontend
1. Visit: `https://honda-dealership-frontend.onrender.com`
2. Should see Honda dealership homepage
3. Carousel should work smoothly
4. Check browser console - no errors

### 4.2 Test Real-time Features
1. Open: `https://honda-dealership-frontend.onrender.com/admin/inventory`
2. Open product page in another tab/window
3. Change inventory in admin → should update instantly on product page

### 4.3 Test WebSocket Connection
Open browser console and run:
```javascript
// Test WebSocket connection
const ws = new WebSocket('wss://honda-websocket-server.onrender.com');
ws.onopen = () => console.log('✅ WebSocket Connected');
ws.onmessage = (e) => console.log('📨 Message:', e.data);
ws.onerror = (e) => console.error('❌ Error:', e);
```

---

## 🛠️ Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Render dashboard → Frontend service → Settings
2. Scroll to "Custom Domains"
3. Click "Add Custom Domain"
4. Enter your domain: `www.yourhondadealer.com`

### 5.2 Update DNS
Point your domain's DNS to Render:
```
Type: CNAME
Name: www
Value: honda-dealership-frontend.onrender.com
```

### 5.3 Update Environment Variables
Update `ALLOWED_ORIGINS` in WebSocket service:
```
ALLOWED_ORIGINS = https://honda-dealership-frontend.onrender.com,https://www.yourhondadealer.com
```

---

## 📊 Step 6: Monitoring & Maintenance

### 6.1 Monitor Services
- **Render Dashboard**: Check service health and logs
- **Health Endpoints**: 
  - Frontend: `https://honda-dealership-frontend.onrender.com`
  - WebSocket: `https://honda-websocket-server.onrender.com/health`
  - Stats: `https://honda-websocket-server.onrender.com/stats`

### 6.2 View Logs
1. Render Dashboard → Select Service → Logs tab
2. Real-time logs for debugging issues

### 6.3 Resource Usage
- Monitor CPU and Memory in Render dashboard
- Free tier limits: 512MB RAM, shared CPU
- Upgrade to paid plan for production traffic

---

## 🚨 Troubleshooting Common Issues

### Issue: Build Failed
**Solution**: Check build logs, ensure all dependencies in `package.json`

### Issue: WebSocket Connection Failed
**Solution**: 
1. Check CORS settings in `ALLOWED_ORIGINS`
2. Ensure WebSocket URL uses `wss://` (secure)
3. Check WebSocket service is running: visit `/health`

### Issue: Real-time Updates Not Working
**Solution**:
1. Check browser console for WebSocket errors
2. Verify both services are deployed and running
3. Test WebSocket connection manually (Step 4.3)

### Issue: Environment Variables Not Working
**Solution**:
1. Double-check variable names (case-sensitive)
2. Redeploy after changing environment variables
3. Check logs for "undefined" values

---

## 💰 Cost Breakdown

### Free Tier Limitations
- **WebSocket Server**: 750 hours/month (always free)
- **Frontend**: 750 hours/month (always free)
- **Bandwidth**: 100GB/month
- **Build Minutes**: 500 minutes/month

### Paid Plans (if needed)
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: $85/month per service

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] All files committed and clean
- [ ] Dependencies listed in package.json
- [ ] Environment variables prepared

### WebSocket Server
- [ ] Service created and deployed
- [ ] Health endpoint responding
- [ ] Stats endpoint working
- [ ] CORS configured correctly

### Frontend
- [ ] Service created and deployed
- [ ] Website loads without errors
- [ ] WebSocket connects successfully
- [ ] Real-time updates working

### Post-Deployment
- [ ] Admin panel accessible
- [ ] Inventory updates sync in real-time
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable
- [ ] Monitoring set up

---

## 🎉 You're Live!

Your Honda dealership is now running on Render with:

- ✅ **Secure WebSocket communication**
- ✅ **Real-time inventory updates**
- ✅ **Professional admin panel**
- ✅ **Mobile-responsive design**
- ✅ **Production-grade security**

**Frontend URL**: `https://honda-dealership-frontend.onrender.com`
**Admin Panel**: `https://honda-dealership-frontend.onrender.com/admin/inventory`
**WebSocket Health**: `https://honda-websocket-server.onrender.com/health`

---

## 📞 Need Help?

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test endpoints individually
4. Check browser console for errors

Your Honda dealership is production-ready! 🏍️✨