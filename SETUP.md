# Expense Manager - Cross-Device Sync Setup

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Start the Server
**Windows:**
- Double-click `start_server.bat`
- Or run: `python server.py`

**Mac/Linux:**
```bash
python server.py
```

### Step 3: Open in Browser
- Open: `http://localhost:5002`
- Your expenses will now sync across all devices!

## 📱 Access from Phone

### On Same WiFi Network:
1. Find your computer's IP address:
   - Windows: Open Command Prompt, type `ipconfig`, look for "IPv4 Address"
   - Mac/Linux: Open Terminal, type `ifconfig`, look for "inet"
   
2. On your phone, open browser and go to:
   ```
   http://YOUR_IP_ADDRESS:5002
   ```
   Example: `http://192.168.1.100:5002`

### From Anywhere (Advanced):
- Deploy server to cloud (Railway, Render, Heroku, etc.)
- Update API URL in `script.js`

## 💾 How It Works

1. **Server Mode (Recommended):**
   - All expenses stored in `expense_data.json` on server
   - Automatically syncs across all devices
   - Also saves to browser localStorage as backup

2. **Offline Mode:**
   - If server is not available, uses localStorage
   - Data is device-specific
   - Will sync when server comes back online

## 🔄 Data Sync

- **Automatic Sync:** Every 30 seconds
- **On Add/Delete:** Immediately syncs with server
- **On Load:** Loads from server first, falls back to localStorage

## 📁 Files

- `expense_data.json` - Server database (created automatically)
- `server.py` - Backend server
- `start_server.bat` - Windows startup script
- `requirements.txt` - Python dependencies

## ⚠️ Important Notes

- Keep the server running for cross-device sync
- Data is stored in `expense_data.json` (backup this file!)
- Server runs on port 5002
- All devices must be on the same network (or deploy to cloud)

## 🆘 Troubleshooting

**Server not starting?**
- Check if Python is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5002 is available

**Can't access from phone?**
- Make sure phone and computer are on same WiFi
- Check firewall settings
- Verify IP address is correct

**Data not syncing?**
- Check server is running
- Check browser console for errors
- Verify network connection

---

**Enjoy synced expense tracking across all your devices! 🎉**
