# Real-Time Synchronization Setup Guide

## Overview
Tombolav2 now supports **real-time synchronization** across multiple browsers using WebSocket technology. When any user draws a number, all connected browsers instantly see the update!

## Installation Steps

### 1. Install New Dependencies

Stop the application if it's running (Ctrl+C), then install the required packages:

```bash
cd Tombolav2
pip install -r requirements.txt
```

This will install:
- Flask 3.0.0
- flask-socketio 5.3.6
- python-socketio 5.11.1

### 2. Start the Application

Run the application with the new SocketIO server:

```bash
python app.py
```

You should see output like:
```
 * Running on http://0.0.0.0:5000
 * Restarting with stat
```

### 3. Test Multi-Browser Sync

1. Open **Browser 1**: http://localhost:5000
2. Open **Browser 2**: http://localhost:5000 (or use a different device on the same network)
3. Click a number in Browser 1
4. **Watch Browser 2 update instantly!** ✨

## Features

### ✅ Real-Time Updates
- **Draw Number**: All browsers see the number instantly
- **Undo**: All browsers see the undo immediately
- **Reset Game**: All browsers reset together
- **Stats**: Drawn/Remaining counts update everywhere

### ✅ Auto-Reconnection
- If connection is lost, the app automatically reconnects
- Shows "Connection lost. Reconnecting..." message
- Syncs state when reconnected

### ✅ Initial State Sync
- New browsers connecting get the current game state immediately
- No need to refresh to see what's been drawn

## How It Works

### WebSocket Events

**Server → Client:**
- `sync_state`: Sends current game state to newly connected clients
- `number_drawn`: Broadcasts when a number is drawn
- `game_reset`: Broadcasts when game is reset
- `number_undone`: Broadcasts when last number is undone

**Client → Server:**
- `connect`: Client connects to server
- `disconnect`: Client disconnects

### Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Browser 1  │◄───────►│   Server    │◄───────►│  Browser 2  │
│             │ WebSocket│ (Flask +   │WebSocket│             │
│  Click #42  │─────────►│  SocketIO) │─────────►│ Shows #42   │
└─────────────┘         └─────────────┘         └─────────────┘
```

## Network Access

### Local Network
To access from other devices on your network:

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`

2. On other devices, open:
   ```
   http://YOUR_IP_ADDRESS:5000
   ```
   Example: `http://192.168.1.100:5000`

### Firewall
If other devices can't connect, you may need to:
- Allow port 5000 through your firewall
- Windows: Windows Defender Firewall → Allow an app
- Mac: System Preferences → Security & Privacy → Firewall

## Use Cases

### Perfect For:
- 🎮 **Bingo Halls**: Caller's screen + multiple player displays
- 📺 **TV Display**: Main board on TV, control from tablet
- 👥 **Multiple Callers**: Backup caller can take over seamlessly
- 🏢 **Large Venues**: Multiple displays showing same game
- 📱 **Mobile + Desktop**: Control from phone, display on computer

## Troubleshooting

### Connection Issues

**Problem**: "Connection lost" message appears
**Solution**: 
- Check if server is running
- Verify network connection
- Restart the Flask application

**Problem**: Updates not syncing
**Solution**:
- Check browser console (F12) for errors
- Verify SocketIO CDN is accessible
- Clear browser cache and reload

**Problem**: Can't connect from other devices
**Solution**:
- Verify devices are on same network
- Check firewall settings
- Use IP address instead of localhost

### Performance

**Multiple Clients**: The server can handle dozens of simultaneous connections
**Latency**: Updates typically appear in < 100ms
**Bandwidth**: Very low - only sends small JSON messages

## Technical Details

### Dependencies
- **Flask-SocketIO**: WebSocket support for Flask
- **python-socketio**: Python Socket.IO server
- **Socket.IO Client**: JavaScript client library (loaded from CDN)

### Data Flow
1. User clicks number in Browser A
2. Browser A sends HTTP POST to `/api/draw`
3. Server updates `tombola_data.json`
4. Server broadcasts WebSocket event to all clients
5. All browsers (A, B, C, etc.) receive event and update display

### Security Notes
- Currently allows all origins (`cors_allowed_origins="*"`)
- For production, restrict to specific domains
- Consider adding authentication for sensitive deployments

## Upgrading from Previous Version

If you're upgrading from the non-real-time version:

1. Backup your `tombola_data.json` file
2. Install new dependencies: `pip install -r requirements.txt`
3. Replace `app.py` with the new version
4. Replace `static/js/app.js` with the new version
5. Update `templates/index.html` to include Socket.IO CDN
6. Restart the application

Your existing game data will be preserved!

## Support

For issues or questions:
1. Check browser console (F12) for JavaScript errors
2. Check server terminal for Python errors
3. Verify all dependencies are installed
4. Test with a single browser first

---

**Enjoy real-time synchronized Tombola gaming! 🎱**