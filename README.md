# 🎱 Tombola Number Tracker

A modern, interactive web application for tracking numbers drawn in Tombola games (1-90). Perfect for bingo halls, community events, or any game requiring number tracking.

## Features

### Core Functionality
- **Visual Number Board**: Interactive 90-number grid showing all available and drawn numbers
- **Manual Draw**: Enter specific numbers to mark as drawn
- **Random Draw**: Automatically select a random number from available numbers
- **Real-time Updates**: Live statistics showing drawn and remaining numbers
- **Recent Numbers Display**: Shows the last 10 drawn numbers for quick reference

### Advanced Features
- **Undo Function**: Reverse the last drawn number if needed
- **Number Checker**: Quickly verify if a specific number has been drawn
- **Game History**: View complete history of all previous games
- **Persistent Storage**: All data saved automatically to JSON file
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Setup Steps

1. **Navigate to the Tombola directory**:
   ```bash
   cd Tombola
   ```

2. **Install required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5000
   ```

## Usage Guide

### Starting a Game

1. Open the application in your web browser
2. The number board displays all numbers 1-90
3. Statistics show 0 drawn, 90 remaining

### Drawing Numbers

**Method 1: Manual Entry**
- Type a number (1-90) in the input field
- Click "Draw Number" or press Enter
- The number will be marked on the board

**Method 2: Click on Board**
- Click any available number on the board
- It will be automatically marked as drawn

**Method 3: Random Draw**
- Click "Random Draw" button
- A random available number will be selected

### Managing the Game

**Undo Last Draw**
- Click "Undo Last" to remove the most recently drawn number
- Useful for correcting mistakes

**Check a Number**
- Click "Check Number"
- Enter a number to verify if it's been drawn
- Get instant confirmation

**View History**
- Click "View History" to see all previous games
- Shows date, time, and all numbers drawn in each game

**Reset Game**
- Click "Reset Game" to start fresh
- Current game is saved to history before reset
- Confirmation required to prevent accidental resets

## Technical Details

### File Structure
```
Tombola/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── tombola_data.json     # Data storage (auto-created)
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styling and animations
│   └── js/
│       └── app.js        # Frontend JavaScript logic
└── README.md             # This file
```

### API Endpoints

The application provides the following REST API endpoints:

- `GET /` - Main application page
- `POST /api/draw` - Draw a specific number
- `GET /api/status` - Get current game status
- `POST /api/reset` - Reset the current game
- `POST /api/undo` - Undo the last drawn number
- `GET /api/history` - Get game history
- `POST /api/check` - Check if a number has been drawn

### Data Storage

All game data is stored in `tombola_data.json`:
- Current drawn numbers
- Game history with timestamps
- Automatically created on first run
- Persists between application restarts

## Features in Detail

### Visual Feedback
- **Color Coding**: Drawn numbers appear in purple gradient
- **Animations**: Smooth transitions when numbers are drawn
- **Hover Effects**: Interactive feedback on all clickable elements
- **Status Messages**: Clear success/error notifications

### Statistics
- **Real-time Counters**: Always shows current drawn/remaining count
- **Recent Numbers**: Last 10 drawn numbers displayed prominently
- **Progress Tracking**: Visual representation of game progress

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface for tablets and phones
- **Adaptive Layout**: Automatically adjusts to screen size
- **Accessible**: Clear typography and high contrast colors

## Troubleshooting

### Application won't start
- Ensure Python 3.7+ is installed: `python --version`
- Install Flask: `pip install Flask`
- Check if port 5000 is available

### Numbers not saving
- Check write permissions in the application directory
- Ensure `tombola_data.json` can be created/modified

### Browser issues
- Clear browser cache
- Try a different browser (Chrome, Firefox, Edge recommended)
- Ensure JavaScript is enabled

## Customization

### Changing the Port
Edit `app.py` and modify the last line:
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change 5000 to your preferred port
```

### Styling
Modify `static/css/style.css` to customize:
- Colors and gradients
- Font sizes and families
- Layout and spacing
- Animations and transitions

### Number Range
To change from 90 numbers to a different range:
1. Update the range in `app.py` (change 90 to your max number)
2. Update the range in `static/js/app.js` (change 90 in createNumberBoard)
3. Update validation in both files

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

- Application runs on localhost by default
- For production use, consider:
  - Adding authentication
  - Using HTTPS
  - Implementing rate limiting
  - Adding input validation middleware

## License

This project is provided as-is for personal and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Inspect browser console for errors
4. Check `tombola_data.json` for data integrity

## Version History

### Version 1.0.0 (Current)
- Initial release
- Full number tracking (1-90)
- Manual and random draw
- Undo functionality
- Game history
- Number checker
- Responsive design
- Persistent storage

## Future Enhancements

Potential features for future versions:
- Multiple game modes (different number ranges)
- Sound effects for number draws
- Export game history to CSV/PDF
- Multi-language support
- Caller mode with automatic announcements
- Pattern recognition (lines, full house, etc.)
- Multiple simultaneous games
- User accounts and authentication

---

**Enjoy your Tombola games! 🎱**