# 🚀 Quick Start Guide - Tombola Number Tracker

## Get Started in 3 Steps

### Step 1: Install Flask
```bash
cd Tombola
pip install -r requirements.txt
```

### Step 2: Run the Application
```bash
python app.py
```

### Step 3: Open in Browser
Navigate to: **http://localhost:5000**

---

## What You'll See

### Main Interface
- **Number Board**: Grid of numbers 1-90
- **Draw Controls**: Input field and buttons
- **Statistics**: Real-time count of drawn/remaining numbers
- **Recent Numbers**: Last 10 drawn numbers

### How to Use

#### Draw a Number (3 Ways)
1. **Type & Enter**: Type number in input field, press Enter or click "Draw Number"
2. **Click Board**: Click any number on the board
3. **Random**: Click "Random Draw" for automatic selection

#### Other Functions
- **Undo Last**: Remove the most recent number
- **Check Number**: Verify if a specific number was drawn
- **View History**: See all previous games
- **Reset Game**: Start fresh (saves current game to history)

---

## Troubleshooting

### Port Already in Use?
Edit `app.py` line 120:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change to 5001 or any free port
```

### Flask Not Found?
```bash
pip install Flask
```

### Can't Access from Other Devices?
The app runs on `0.0.0.0` so it's accessible from other devices on your network.
Find your IP address and use: `http://YOUR_IP:5000`

---

## Features at a Glance

✅ Track numbers 1-90  
✅ Visual board with color coding  
✅ Manual and random draw  
✅ Undo functionality  
✅ Game history  
✅ Number checker  
✅ Persistent storage  
✅ Mobile responsive  
✅ No database required  

---

## File Structure
```
Tombola/
├── app.py              # Backend server
├── requirements.txt    # Dependencies
├── tombola_data.json  # Auto-created data file
├── templates/
│   └── index.html     # Main page
└── static/
    ├── css/
    │   └── style.css  # Styling
    └── js/
        └── app.js     # Frontend logic
```

---

## Tips

💡 **Keyboard Shortcut**: Press Enter after typing a number to draw it quickly  
💡 **Mobile Friendly**: Works great on tablets for calling numbers  
💡 **Data Persists**: All numbers saved automatically, survives restarts  
💡 **History**: Every game is saved when you reset  

---

**Ready to play? Start the app and enjoy! 🎱**

For detailed documentation, see [README.md](README.md)