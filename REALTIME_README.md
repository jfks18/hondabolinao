# 🏍️ Honda Bolinao Real-Time Inventory System

A complete real-time inventory management system for Honda 3S dealership with automatic updates across all connected devices.

## 🚀 Features

- ✅ **Real-time inventory updates** - No page refresh needed
- ✅ **Multi-user synchronization** - All users see changes instantly
- ✅ **Live stock management** - Update quantities and availability in real-time
- ✅ **Dynamic promo system** - Create and manage promos with automatic display
- ✅ **Visual feedback** - Flash animations when data updates
- ✅ **Connection status** - Shows real-time connection health
- ✅ **Toast notifications** - See what changed as it happens
- ✅ **Auto-reconnection** - Automatically reconnects if connection drops

## 📁 Project Structure

```
hondabolinao/
├── app/
│   ├── contexts/
│   │   └── InventoryContext.tsx     # Real-time inventory state management
│   ├── services/
│   │   └── realtime.ts              # WebSocket service
│   ├── types/
│   │   └── inventory.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── notifications.ts         # Toast notification system
│   ├── admin/
│   │   └── inventory/
│   │       └── page.tsx             # Admin dashboard
│   └── components/
│       └── ProductCard.tsx          # Enhanced with real-time data
├── websocket-server.js              # Real-time WebSocket server
└── package.json
```

## 🛠️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Real-Time System
```bash
# Start both WebSocket server and Next.js app
npm run dev:full

# OR start them separately:
npm run ws     # WebSocket server (port 8080)
npm run dev    # Next.js app (port 3000)
```

### 3. Access the Applications
- **Main Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/inventory
- **WebSocket Health**: http://localhost:8080/health

## 🎛️ Admin Dashboard Usage

### Real-Time Inventory Management

1. **Update Stock Quantities**
   - Use +/- buttons for quick adjustments
   - Type directly in the input field
   - Changes sync instantly across all devices

2. **Toggle Availability**
   - Click availability buttons to enable/disable colors
   - Unavailable items appear grayed out on product cards

3. **Monitor Connection Status**
   - Green dot = Connected and receiving updates
   - Red dot = Disconnected (will auto-reconnect)

### Promo Management

1. **Create New Promos**
   - Fill out the promo form
   - Set start/end dates
   - Add freebies (comma-separated)
   - Specify model IDs to target

2. **Toggle Active Promos**
   - Click ON/OFF buttons to activate/deactivate
   - Changes appear immediately on product cards

## 🔄 How Real-Time Updates Work

### 1. Admin Makes Change
```typescript
// Admin updates quantity
await updateInventory(itemId, newQuantity);
```

### 2. WebSocket Broadcasts
```javascript
// Server broadcasts to all clients
clients.forEach(client => {
  client.send(JSON.stringify(update));
});
```

### 3. React State Updates
```typescript
// All connected clients receive update
const handleInventoryUpdate = (data) => {
  setInventory(prev => updateItem(prev, data));
  showNotification(`Stock updated: ${data.quantity}`);
};
```

### 4. UI Updates Instantly
- Stock badges update automatically
- Color availability changes
- Promo displays appear/disappear
- Visual flash effects show what changed

## 📦 Product Card Features

### Real-Time Stock Indicators
- **✅ IN STOCK (5)** - Green badge for available items
- **⚠️ LOW STOCK (2)** - Yellow badge for items ≤ 3 units
- **❌ OUT OF STOCK** - Red badge for unavailable items

### Live Promo Display
- **🔥 LIVE PROMO!** - Animated badge for active promotions
- Automatic freebie display with 🎁 icons
- Promo details update instantly when changed

### Dynamic Color Selection
- Only shows available colors in real-time
- Stock count per color displayed
- Unavailable colors automatically hidden

## 🔧 Configuration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_WS_URL=ws://localhost:8080  # WebSocket server URL
```

### WebSocket Server Settings
```javascript
// websocket-server.js
const PORT = process.env.PORT || 8080;
```

## 🎯 API Integration (Production)

Replace the sample data with real API calls:

```typescript
// In InventoryContext.tsx
const updateInventory = async (itemId: string, quantity: number) => {
  // Save to database
  await fetch('/api/inventory', {
    method: 'PUT',
    body: JSON.stringify({ itemId, quantity })
  });
  
  // Broadcast update
  realtimeService.broadcast('inventory', updatedItem);
};
```

## 🚨 Troubleshooting

### WebSocket Connection Issues
1. **Check server is running**: `npm run ws`
2. **Verify port 8080 is free**: `netstat -an | findstr 8080`
3. **Check browser console** for connection errors

### Real-Time Updates Not Working
1. **Verify connection status** in admin dashboard
2. **Check network tab** for WebSocket connection
3. **Refresh page** to re-establish connection

### Performance Optimization
1. **Limit update frequency** for high-traffic scenarios
2. **Use debouncing** for rapid quantity changes
3. **Implement connection pooling** for multiple admin users

## 📱 Mobile Responsiveness

The system is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets  
- ✅ Mobile phones
- ✅ All modern browsers

## 🔒 Security Considerations

For production deployment:

1. **Add authentication** to admin routes
2. **Validate all updates** server-side
3. **Use WSS (secure WebSocket)** for HTTPS sites
4. **Implement rate limiting** for API calls
5. **Add user permissions** for different admin levels

## 🎉 Ready to Use!

Your Honda 3S dealership now has a complete real-time inventory system! 

Changes made by any admin user will instantly appear on all customer devices without requiring page refreshes. Stock levels, color availability, and promotional offers update automatically across your entire website.

Perfect for busy dealerships where inventory changes frequently! 🏍️✨