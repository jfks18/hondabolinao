'use client';

type UpdateType = 'inventory' | 'promo' | 'availability' | 'auth' | 'ping';

interface RealtimeUpdate {
  type: UpdateType;
  data: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  signature?: string; // Message integrity check
}

interface SecurityConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  messageTimeout: number;
  rateLimitPerMinute: number;
  allowedOrigins: string[];
}

class RealtimeService {
  private ws: WebSocket | null = null;
  private listeners: Map<UpdateType, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageQueue: RealtimeUpdate[] = [];
  private rateLimitTracker: Map<string, number[]> = new Map();
  private sessionId: string;
  private userId: string | null = null;
  private authToken: string | null = null;
  
  private readonly security: SecurityConfig = {
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatInterval: 30000, // 30 seconds
    messageTimeout: 10000, // 10 seconds
    rateLimitPerMinute: 60, // Max 60 messages per minute
    allowedOrigins: [
      process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || 'https://honda-websocket-server.onrender.com',
      'https://honda-dealership-frontend.onrender.com', // Your Render domain
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
    ]
  };

  constructor() {
    this.sessionId = this.generateSecureId();
    this.initializeSecurity();
    this.connect();
  }

  // 🔐 Security: Generate cryptographically secure IDs
  private generateSecureId(): string {
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // 🛡️ Security: Initialize security measures
  private initializeSecurity() {
    // Rate limiting cleanup
    setInterval(() => {
      const now = Date.now();
      this.rateLimitTracker.forEach((timestamps, key) => {
        this.rateLimitTracker.set(key, timestamps.filter(t => now - t < 60000));
      });
    }, 60000);

    // Clear auth token on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.authToken = null;
        this.disconnect();
      });
    }

    // Origin validation
    if (!this.isValidOrigin()) {
      console.error('🚨 Security: Invalid origin detected');
      return;
    }
  }

  // 🔒 Security: Validate message origin
  private isValidOrigin(): boolean {
    if (typeof window === 'undefined') return true; // Server-side
    const currentOrigin = window.location.origin;
    return this.security.allowedOrigins.includes(currentOrigin);
  }

  // 🚦 Security: Rate limiting
  private isRateLimited(identifier: string = 'default'): boolean {
    const now = Date.now();
    const timestamps = this.rateLimitTracker.get(identifier) || [];
    
    // Remove old timestamps (older than 1 minute)
    const recentTimestamps = timestamps.filter(t => now - t < 60000);
    
    if (recentTimestamps.length >= this.security.rateLimitPerMinute) {
      console.warn('🚨 Rate limit exceeded for:', identifier);
      return true;
    }

    recentTimestamps.push(now);
    this.rateLimitTracker.set(identifier, recentTimestamps);
    return false;
  }

  // 🔐 Security: Message encryption (simple XOR for demo)
  private encryptMessage(message: string, key: string): string {
    let encrypted = '';
    for (let i = 0; i < message.length; i++) {
      encrypted += String.fromCharCode(
        message.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted); // Base64 encode
  }

  private decryptMessage(encrypted: string, key: string): string {
    try {
      const decoded = atob(encrypted); // Base64 decode
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return decrypted;
    } catch (error) {
      console.error('🚨 Message decryption failed:', error);
      return '';
    }
  }

  // 🔐 Security: Authentication with JWT-like token
  public authenticate(userId: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // In production, validate against your backend
      const validCredentials = this.validateCredentials(userId, password);
      
      if (validCredentials) {
        this.userId = userId;
        this.authToken = this.generateAuthToken(userId);
        console.log('🔐 Authentication successful for:', userId);
        resolve(true);
      } else {
        console.error('🚨 Authentication failed for:', userId);
        resolve(false);
      }
    });
  }

  // 🛡️ Security: Validate credentials (implement your logic)
  private validateCredentials(userId: string, password: string): boolean {
    // TODO: Replace with actual authentication logic
    const adminUsers = process.env.NEXT_PUBLIC_ADMIN_USERS?.split(',') || ['admin'];
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'honda123';
    
    return adminUsers.includes(userId) && password === adminPassword;
  }

  // 🔑 Security: Generate authentication token
  private generateAuthToken(userId: string): string {
    const payload = {
      userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      permissions: this.getUserPermissions(userId)
    };
    
    // Simple token generation (use proper JWT in production)
    return btoa(JSON.stringify(payload));
  }

  // 👤 Security: Get user permissions
  private getUserPermissions(userId: string): string[] {
    // Define user permissions
    const permissions: Record<string, string[]> = {
      'admin': ['inventory:read', 'inventory:write', 'promo:read', 'promo:write'],
      'manager': ['inventory:read', 'inventory:write', 'promo:read'],
      'staff': ['inventory:read', 'promo:read']
    };
    
    return permissions[userId] || ['inventory:read'];
  }

  // 🔒 Security: Validate authentication token
  private validateAuthToken(): boolean {
    if (!this.authToken) return false;
    
    try {
      const payload = JSON.parse(atob(this.authToken));
      const now = Date.now();
      const tokenAge = now - payload.timestamp;
      
      // Token expires after 8 hours
      if (tokenAge > 8 * 60 * 60 * 1000) {
        console.warn('🚨 Auth token expired');
        this.authToken = null;
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('🚨 Invalid auth token:', error);
      return false;
    }
  }

  // 🔐 Security: Enhanced connection with auth
  private connect() {
    if (!this.isValidOrigin()) {
      console.error('🚨 Connection blocked: Invalid origin');
      return;
    }

    try {
      // Use WSS for production (secure WebSocket)
      const wsUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_WSS_URL || 'wss://your-websocket-server.onrender.com'
        : 'ws://localhost:8081';

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔄 Secure WebSocket connection established');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.sendAuthHandshake();
      };

      this.ws.onmessage = (event) => {
        if (this.isRateLimited(this.userId || 'anonymous')) {
          console.warn('🚨 Message dropped due to rate limiting');
          return;
        }

        try {
          const update: RealtimeUpdate = JSON.parse(event.data);
          
          // Validate message structure
          if (!this.validateMessage(update)) {
            console.error('🚨 Invalid message format received');
            return;
          }

          this.handleUpdate(update);
        } catch (error) {
          console.error('🚨 Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket connection closed:', event.code);
        this.stopHeartbeat();
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('🚨 WebSocket error:', error);
      };

    } catch (error) {
      console.error('🚨 Failed to connect to WebSocket:', error);
      this.handleReconnect();
    }
  }

  // 🔒 Security: Send authentication handshake
  private sendAuthHandshake() {
    if (!this.validateAuthToken()) {
      console.warn('🚨 No valid auth token for handshake');
      return;
    }

    const handshake = {
      type: 'auth' as UpdateType,
      data: {
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now()
      },
      timestamp: new Date(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      signature: this.generateMessageSignature('handshake')
    };

    this.sendSecureMessage(handshake);
  }

  // 🛡️ Security: Validate incoming messages
  private validateMessage(update: RealtimeUpdate): boolean {
    // Check required fields
    if (!update.type || !update.data || !update.timestamp) {
      return false;
    }

    // Validate timestamp (not too old or future)
    const messageTime = new Date(update.timestamp).getTime();
    const now = Date.now();
    const timeDiff = Math.abs(now - messageTime);
    
    if (timeDiff > this.security.messageTimeout) {
      console.warn('🚨 Message timestamp validation failed');
      return false;
    }

    // Validate message signature if present
    if (update.signature && !this.validateMessageSignature(update)) {
      console.warn('🚨 Message signature validation failed');
      return false;
    }

    return true;
  }

  // 🔐 Security: Generate message signature
  private generateMessageSignature(content: string): string {
    // Simple signature generation (use HMAC in production)
    const secret = this.sessionId + (this.authToken || '');
    return btoa(content + secret).slice(0, 16);
  }

  // 🔒 Security: Validate message signature
  private validateMessageSignature(update: RealtimeUpdate): boolean {
    const expectedSignature = this.generateMessageSignature(JSON.stringify(update.data));
    return update.signature === expectedSignature;
  }

  // ❤️ Security: Heartbeat to detect connection issues
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date() }));
      }
    }, this.security.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 🔒 Security: Enhanced message sending with encryption
  private sendSecureMessage(update: RealtimeUpdate) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('🚨 Cannot send message: WebSocket not connected');
      return;
    }

    if (this.isRateLimited(this.userId || 'anonymous')) {
      console.warn('🚨 Message blocked by rate limiter');
      return;
    }

    // Add security headers
    update.sessionId = this.sessionId;
    update.userId = this.userId || undefined;
    update.signature = this.generateMessageSignature(JSON.stringify(update.data));

    const message = JSON.stringify(update);
    
    // Encrypt sensitive messages in production
    if (process.env.NODE_ENV === 'production' && update.type !== 'ping') {
      const encryptedMessage = this.encryptMessage(message, this.sessionId);
      this.ws.send(JSON.stringify({ encrypted: encryptedMessage, sessionId: this.sessionId }));
    } else {
      this.ws.send(message);
    }
  }

  // 🔐 Public methods with security checks
  public broadcast(type: UpdateType, data: any) {
    if (type !== 'ping' && !this.validateAuthToken()) {
      console.error('🚨 Broadcast blocked: Invalid authentication');
      return;
    }

    const update: RealtimeUpdate = {
      type,
      data,
      timestamp: new Date(),
      userId: this.userId || undefined,
      sessionId: this.sessionId
    };

    this.sendSecureMessage(update);
  }

  public subscribe(type: UpdateType, listener: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    return () => {
      this.listeners.get(type)?.delete(listener);
    };
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // 🔒 Security: Safe disconnect
  public disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
    }
    this.authToken = null;
    this.userId = null;
  }

  // 🛡️ Security: Get connection security status
  public getSecurityStatus() {
    return {
      authenticated: !!this.authToken && this.validateAuthToken(),
      userId: this.userId,
      sessionId: this.sessionId,
      connected: this.ws?.readyState === WebSocket.OPEN,
      origin: typeof window !== 'undefined' ? window.location.origin : 'server',
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true
    };
  }

  private handleUpdate(update: RealtimeUpdate) {
    const listeners = this.listeners.get(update.type);
    if (listeners) {
      listeners.forEach(listener => listener(update.data));
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.security.maxReconnectAttempts) {
      const delay = this.security.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      setTimeout(() => {
        console.log(`🔄 Reconnecting... (${this.reconnectAttempts + 1}/${this.security.maxReconnectAttempts})`);
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('🚨 Max reconnection attempts reached');
    }
  }
}

// Export singleton with authentication
export const realtimeService = new RealtimeService();

// Export security utilities
export const SecurityUtils = {
  validateOrigin: (origin: string, allowedOrigins: string[]) => {
    return allowedOrigins.includes(origin);
  },
  
  generateCSRFToken: () => {
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  sanitizeInput: (input: string) => {
    return input.replace(/[<>\"']/g, '');
  }
};
