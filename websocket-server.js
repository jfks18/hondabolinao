// Honda Dealership Secure WebSocket Server for Production Deployment
const WebSocket = require('ws');
const http = require('http');
const { loadDB, upsertInventoryItem, upsertPromo, deletePromo, DB_PATH } = require('./utils/jsonDb');

class SecureWebSocketServer {
  constructor() {
    this.clients = new Map();
    this.rateLimitTracker = new Map();
    this.authenticatedUsers = new Map();
  this.inventory = [];
  this.promos = [];
    
    // Security configuration - Production ready with your specific URLs
    this.security = {
      rateLimitPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE) || 60,
      maxConnections: parseInt(process.env.MAX_CONNECTIONS) || 100,
      allowedOrigins: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : [
            'http://localhost:3000',
            'https://localhost:3000', 
            'https://honda-dealership-frontend.onrender.com/',
            'https://hondabolinao-20dg.onrender.com',
            'https://honda-websocket-server.onrender.com'
          ],
      enableRateLimit: process.env.ENABLE_RATE_LIMITING === 'true',
      enableAuth: process.env.ENABLE_AUTH === 'true'
    };
    
    this.initializeServer();

    // Load persistent data (inventory + promos) from JSON DB on startup
    loadDB().then(data => {
      this.inventory = Array.isArray(data.inventory) ? data.inventory : [];
      this.promos = Array.isArray(data.promos) ? data.promos : [];
      console.log(`📦 Loaded inventory from ${DB_PATH} — ${this.inventory.length} items`);
      console.log(`🎯 Loaded promos from ${DB_PATH} — ${this.promos.length} items`);
    }).catch(err => {
      console.error('🚨 Failed to load DB:', err);
      this.inventory = [];
      this.promos = [];
    });
  }

  initializeServer() {
    // Create HTTP server for health checks
    this.server = http.createServer();
    
    // Create WebSocket server with security
    this.wss = new WebSocket.Server({
      server: this.server,
      verifyClient: (info) => this.verifyClient(info)
    });

    console.log('🚀 Honda Secure WebSocket Server Starting...');
    console.log(`🛡️  Security: Rate Limiting ${this.security.enableRateLimit ? 'ON' : 'OFF'}`);
    console.log(`🔐 Authentication: ${this.security.enableAuth ? 'ON' : 'OFF'}`);
    console.log(`🌐 Allowed Origins: ${this.security.allowedOrigins.join(', ')}`);
    
    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    // Setup HTTP routes
    this.setupHTTPRoutes();

    // Cleanup rate limiting data every minute
    setInterval(() => {
      this.cleanupRateLimitData();
    }, 60000);
  }

  // 🛡️ Security: Verify client connection
  verifyClient(info) {
    const origin = info.origin;
    const ip = info.req.socket.remoteAddress;
    
    console.log(`📡 WebSocket connection attempt from origin: ${origin}`);
    console.log(`� Client IP: ${ip}`);
    
    // In production, allow all Render domains by default
    if (process.env.NODE_ENV === 'production') {
      console.log(`🚀 Production mode: Allowing connection from ${origin}`);
      return true;
    }
    
    // For development/other environments, check origins
    const isLocalhost = origin?.includes('localhost') || origin?.includes('127.0.0.1');
    const isRenderDomain = origin?.includes('onrender.com');
    const noOrigin = !origin;
    
    // Check configured allowed origins
    const allowedOrigins = this.security.allowedOrigins.filter(Boolean);
    const isAllowedOrigin = allowedOrigins.length === 0 || allowedOrigins.includes(origin);
    
    if (isLocalhost || isRenderDomain || noOrigin || isAllowedOrigin) {
      console.log(`✅ Connection allowed from: ${origin || 'no-origin'}`);
      return true;
    }
    
    console.warn(`🚨 Rejected connection from: ${origin}`);
    console.warn(`🔍 Allowed origins: ${allowedOrigins.join(', ')}`);
    return false;

    // Connection limit
    if (this.wss.clients.size >= this.security.maxConnections) {
      console.warn(`🚨 Connection limit reached (${this.security.maxConnections})`);
      return false;
    }

    // Rate limiting by IP
    if (this.isRateLimitedByIP(ip)) {
      console.warn(`🚨 Rate limited connection from IP: ${ip}`);
      return false;
    }

    return true;
  }

  // 🚦 Rate limiting by IP
  isRateLimitedByIP(ip) {
    if (!this.security.enableRateLimit) return false;
    
    const now = Date.now();
    const connections = this.rateLimitTracker.get(ip) || [];
    
    // Remove old connections (older than 1 minute)
    const recentConnections = connections.filter(t => now - t < 60000);
    
    // Allow max 10 connections per minute per IP
    if (recentConnections.length >= 10) {
      return true;
    }

    recentConnections.push(now);
    this.rateLimitTracker.set(ip, recentConnections);
    return false;
  }

  // 🔐 Handle new WebSocket connection
  handleConnection(ws, req) {
    const clientId = this.generateClientId();
    const clientIP = req.socket.remoteAddress;
    
    console.log(`🔌 Client connected: ${clientId} from ${clientIP} - Total: ${this.clients.size + 1}`);
    
    // Store client info
    this.clients.set(ws, {
      id: clientId,
      ip: clientIP,
      connected: Date.now(),
      authenticated: !this.security.enableAuth, // Auto-auth if auth disabled
      userId: null,
      lastActivity: Date.now()
    });

    // Send welcome message
    this.sendToClient(ws, {
      type: 'notification',
      data: {
        message: '🔄 Connected to Honda Secure Real-time System',
        type: 'success',
        features: {
          secure: true,
          rateLimited: this.security.enableRateLimit,
          authenticated: this.security.enableAuth
        }
      },
      timestamp: new Date()
    });

    // Set up message handlers
    ws.on('message', (data) => {
      this.handleMessage(ws, data);
    });

    ws.on('close', (code) => {
      const client = this.clients.get(ws);
      console.log(`🔌 Client ${client?.id} disconnected - Remaining: ${this.clients.size - 1}`);
      this.clients.delete(ws);
    });

    ws.on('error', (error) => {
      const client = this.clients.get(ws);
      console.error(`🚨 WebSocket error for ${client?.id}:`, error);
      this.clients.delete(ws);
    });

    // Set up ping/pong for connection health
    this.setupHeartbeat(ws);
  }

  // 📨 Handle incoming messages
  handleMessage(ws, data) {
    const client = this.clients.get(ws);
    if (!client) return;

    try {
      const message = JSON.parse(data.toString());
      
      // Update last activity
      client.lastActivity = Date.now();

      // Handle different message types
      switch (message.type) {
        case 'auth':
          this.handleAuthentication(ws, message);
          break;
        case 'ping':
          this.sendToClient(ws, { type: 'pong', timestamp: new Date() });
          break;
        case 'inventory':
        case 'promo':
        case 'availability':
          this.handleDataUpdate(ws, message);
          break;
        default:
          console.log(`📦 Broadcasting ${message.type} update from ${client.id}`);
          this.broadcastMessage(message, ws);
      }
    } catch (error) {
      console.error(`🚨 Error parsing message from ${client?.id}:`, error);
    }
  }

  // 🔐 Handle authentication (simple version)
  handleAuthentication(ws, message) {
    const client = this.clients.get(ws);
    if (!client) return;

    // Simple auth - in production, validate against proper auth service
    const { sessionId, userId } = message.data || {};
    
    if (sessionId && userId) {
      client.authenticated = true;
      client.userId = userId;
      
      console.log(`🔐 Client ${client.id} authenticated as ${userId}`);
      
      this.sendToClient(ws, {
        type: 'auth_success',
        data: { userId, timestamp: Date.now() }
      });
    } else {
      this.sendToClient(ws, {
        type: 'auth_error',
        data: { message: 'Authentication failed' }
      });
    }
  }

  // 📊 Handle data updates and broadcast
  handleDataUpdate(ws, message) {
    const client = this.clients.get(ws);
    if (!client || (this.security.enableAuth && !client.authenticated)) {
      console.warn(`🚨 Unauthorized data update from ${client?.id}`);
      return;
    }

    console.log(`📦 Received ${message.type} update from ${client.userId || client.id}`);

    // Persist inventory updates to JSON DB and broadcast the updated inventory
    if (message.type === 'inventory') {
      const item = message.data;
      // Upsert the item into the JSON DB and in-memory store
      upsertInventoryItem(item).then(updatedInventory => {
        this.inventory = updatedInventory;
        // Broadcast the full inventory to all clients
        this.broadcastMessage({ type: 'inventory', data: this.inventory }, ws);
      }).catch(err => {
        console.error('🚨 Failed to persist inventory update:', err);
      });
      return;
    }

    // Persist promo updates similarly
    if (message.type === 'promo') {
      const promo = message.data;
      upsertPromo(promo).then(updatedPromos => {
        this.promos = updatedPromos;
        // Broadcast the promo update to all clients (single promo)
        this.broadcastMessage({ type: 'promo', data: promo }, ws);
      }).catch(err => {
        console.error('🚨 Failed to persist promo update:', err);
      });
      return;
    }

    // Other update types: just broadcast
    console.log(`📦 Broadcasting ${message.type} update from ${client.userId || client.id}`);
    this.broadcastMessage(message, ws);
  }

  // 📡 Broadcast message to all clients
  broadcastMessage(message, excludeWs = null) {
    let broadcastCount = 0;
    
    this.clients.forEach((client, ws) => {
      if (ws !== excludeWs && 
          (!this.security.enableAuth || client.authenticated) && 
          ws.readyState === WebSocket.OPEN) {
        this.sendToClient(ws, message);
        broadcastCount++;
      }
    });

    console.log(`📡 Broadcasted to ${broadcastCount} clients`);
  }

  // 📤 Send message to specific client
  sendToClient(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('🚨 Error sending message:', error);
      }
    }
  }

  // ❤️ Setup heartbeat for connection health
  setupHeartbeat(ws) {
    const interval = setInterval(() => {
      const client = this.clients.get(ws);
      if (!client) {
        clearInterval(interval);
        return;
      }

      // Check if client is still active (last activity within 5 minutes)
      const now = Date.now();
      const inactiveTime = now - client.lastActivity;
      
      if (inactiveTime > 5 * 60 * 1000) { // 5 minutes
        console.log(`⏰ Disconnecting inactive client: ${client.id}`);
        ws.close(1000, 'Inactive connection');
        clearInterval(interval);
        return;
      }

      // Send ping if connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000); // Every 30 seconds

    ws.on('pong', () => {
      const client = this.clients.get(ws);
      if (client) {
        client.lastActivity = Date.now();
      }
    });

    ws.on('close', () => {
      clearInterval(interval);
    });
  }

  // 🌐 Setup HTTP routes
  setupHTTPRoutes() {
    this.server.on('request', (req, res) => {
      // Enable CORS - respond with the request origin when it's allowed.
      // Browsers require a single origin or '*' for Access-Control-Allow-Origin.
      const requestOrigin = req.headers.origin;
      const allowed = (this.security.allowedOrigins || []).filter(Boolean);

      if (requestOrigin && (allowed.length === 0 || allowed.includes(requestOrigin) || (process.env.NODE_ENV === 'production' && requestOrigin.includes('onrender.com')))) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        res.setHeader('Vary', 'Origin');
      } else if (allowed.length === 1) {
        // If there is exactly one allowed origin configured, mirror it (useful for server-to-server calls)
        res.setHeader('Access-Control-Allow-Origin', allowed[0]);
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Authorization, X-Requested-With');
      // Allow credentials when needed
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.getHealthStats()));
        return;
      }

      // Handle both /inventory and /api/inventory routes
      if ((req.url === '/inventory' || req.url === '/api/inventory') && req.method === 'GET') {
        // Return the current DB (inventory + promos) directly from the JSON DB on disk
        loadDB().then(data => {
          const inv = Array.isArray(data.inventory) ? data.inventory : [];
          const promos = Array.isArray(data.promos) ? data.promos : [];
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ inventory: inv, promos }));
        }).catch(err => {
          console.error('🚨 /inventory GET error (DB read):', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: String(err) }));
        });
        return;
      }

      if ((req.url === '/inventory' || req.url === '/api/inventory') && req.method === 'POST') {
        // Accept a JSON body with a single item to upsert
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const item = JSON.parse(body);
            const updated = await upsertInventoryItem(item);
            this.inventory = updated;
            // Broadcast update to all clients
            this.broadcastMessage({ type: 'inventory', data: this.inventory });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, inventory: this.inventory }));
          } catch (err) {
            console.error('🚨 /inventory POST error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        });
        return;
      }

      // Delete promo: DELETE /promo?id=PROMO_ID or /api/promo?id=PROMO_ID
      if ((req.url.startsWith('/promo') || req.url.startsWith('/api/promo')) && req.method === 'DELETE') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const promoId = url.searchParams.get('id');
        if (!promoId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'missing id' }));
          return;
        }
        deletePromo(promoId).then(updated => {
          this.promos = updated;
          this.broadcastMessage({ type: 'promo', data: { id: promoId, deleted: true } });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, promos: this.promos }));
        }).catch(err => {
          console.error('🚨 /promo DELETE error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: String(err) }));
        });
        return;
      }

      if ((req.url === '/promo' || req.url === '/api/promo') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const promo = JSON.parse(body);
            const updated = await upsertPromo(promo);
            this.promos = updated;
            // Broadcast the promo to all clients (single promo)
            this.broadcastMessage({ type: 'promo', data: promo });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, promos: this.promos }));
          } catch (err) {
            console.error('🚨 /promo POST error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        });
        return;
      }

      // GET /promo or /api/promo - return just promos
      if ((req.url === '/promo' || req.url === '/api/promo') && req.method === 'GET') {
        loadDB().then(data => {
          const promos = Array.isArray(data.promos) ? data.promos : [];
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ promos }));
        }).catch(err => {
          console.error('🚨 /promo GET error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ promos: [] }));
        });
        return;
      } else if (req.url === '/stats') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.getDetailedStats()));
      } else {
        res.writeHead(404);
        res.end('Honda WebSocket Server - Endpoints: /health, /stats');
      }
    });
  }

  // 📊 Get health statistics
  getHealthStats() {
    const authenticatedClients = Array.from(this.clients.values()).filter(c => c.authenticated);
    
    return {
      status: 'ok',
      clients: this.clients.size,
      authenticated: authenticatedClients.length,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  // 📊 Get detailed statistics
  getDetailedStats() {
    const clients = Array.from(this.clients.values());
    const now = Date.now();
    
    return {
      ...this.getHealthStats(),
      security: this.security,
      rateLimitedIPs: this.rateLimitTracker.size,
      averageConnectionTime: clients.reduce((sum, c) => sum + (now - c.connected), 0) / clients.length || 0,
      memoryUsage: process.memoryUsage(),
      clientDetails: clients.map(c => ({
        id: c.id,
        authenticated: c.authenticated,
        userId: c.userId,
        connectedFor: now - c.connected,
        lastActivity: now - c.lastActivity
      }))
    };
  }

  // 🔧 Generate unique client ID
  generateClientId() {
    return 'client_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // 🧹 Cleanup old rate limiting data
  cleanupRateLimitData() {
    const now = Date.now();
    const cutoff = now - 60000; // 1 minute ago
    
    this.rateLimitTracker.forEach((timestamps, ip) => {
      const recent = timestamps.filter(t => t > cutoff);
      if (recent.length === 0) {
        this.rateLimitTracker.delete(ip);
      } else {
        this.rateLimitTracker.set(ip, recent);
      }
    });
  }

  // 🚀 Start the server
  listen(port) {
    const PORT = port || process.env.PORT || 8081;
    
    // Bind explicitly to 0.0.0.0 so platform load-balancers (like Render) can reach the server
    this.server.listen(PORT, '0.0.0.0', () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🏍️  Honda Secure Real-time Server running on port ${PORT}`);
      console.log(`📊 Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`📈 Statistics: http://0.0.0.0:${PORT}/stats`);
      console.log(`🔄 WebSocket: ws://0.0.0.0:${PORT}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💡 Ready for secure real-time inventory updates!');
    });
  }

  // 🛑 Graceful shutdown
  shutdown() {
    console.log('🛑 Server shutting down...');
    
    this.wss.close(() => {
      this.server.close(() => {
        console.log('✅ Server closed gracefully');
        process.exit(0);
      });
    });
  }
}

// Initialize and start the server
const hondaServer = new SecureWebSocketServer();
hondaServer.listen();

// Handle graceful shutdown
process.on('SIGTERM', () => hondaServer.shutdown());
process.on('SIGINT', () => hondaServer.shutdown());

// Export for testing
module.exports = { SecureWebSocketServer, server: hondaServer };