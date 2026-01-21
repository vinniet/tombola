from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from datetime import datetime
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'tombola-secret-key-change-in-production'
socketio = SocketIO(app, cors_allowed_origins="*")

# File to store drawn numbers
DATA_FILE = 'tombola_data.json'

def load_data():
    """Load drawn numbers from file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        'drawn_numbers': [],
        'game_history': [],
        'current_game_start': None
    }

def save_data(data):
    """Save drawn numbers to file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/draw', methods=['POST'])
def draw_number():
    """Draw a new number"""
    data = load_data()
    number = request.json.get('number')
    
    if not number or not isinstance(number, int) or number < 1 or number > 90:
        return jsonify({'error': 'Invalid number. Must be between 1 and 90'}), 400
    
    if number in data['drawn_numbers']:
        return jsonify({'error': f'Number {number} has already been drawn'}), 400
    
    data['drawn_numbers'].append(number)
    save_data(data)
    
    # Broadcast to all connected clients
    socketio.emit('number_drawn', {
        'number': number,
        'drawn_numbers': data['drawn_numbers'],
        'total_drawn': len(data['drawn_numbers']),
        'remaining': 90 - len(data['drawn_numbers'])
    })
    
    return jsonify({
        'success': True,
        'number': number,
        'total_drawn': len(data['drawn_numbers']),
        'remaining': 90 - len(data['drawn_numbers'])
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current game status"""
    data = load_data()
    return jsonify({
        'drawn_numbers': data['drawn_numbers'],
        'total_drawn': len(data['drawn_numbers']),
        'remaining': 90 - len(data['drawn_numbers']),
        'available_numbers': [n for n in range(1, 91) if n not in data['drawn_numbers']]
    })

@app.route('/api/reset', methods=['POST'])
def reset_game():
    """Reset the game"""
    data = load_data()
    
    # Save current game to history
    if data['drawn_numbers']:
        data['game_history'].append({
            'date': datetime.now().isoformat(),
            'numbers_drawn': len(data['drawn_numbers']),
            'numbers': sorted(data['drawn_numbers'])
        })
    
    # Reset current game
    data['drawn_numbers'] = []
    data['current_game_start'] = datetime.now().isoformat()
    save_data(data)
    
    # Broadcast reset to all connected clients
    socketio.emit('game_reset', {
        'drawn_numbers': [],
        'total_drawn': 0,
        'remaining': 90
    })
    
    return jsonify({'success': True, 'message': 'Game reset successfully'})

@app.route('/api/undo', methods=['POST'])
def undo_last():
    """Undo the last drawn number"""
    data = load_data()
    
    if not data['drawn_numbers']:
        return jsonify({'error': 'No numbers to undo'}), 400
    
    last_number = data['drawn_numbers'].pop()
    save_data(data)
    
    # Broadcast undo to all connected clients
    socketio.emit('number_undone', {
        'undone_number': last_number,
        'drawn_numbers': data['drawn_numbers'],
        'total_drawn': len(data['drawn_numbers']),
        'remaining': 90 - len(data['drawn_numbers'])
    })
    
    return jsonify({
        'success': True,
        'undone_number': last_number,
        'total_drawn': len(data['drawn_numbers'])
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get game history"""
    data = load_data()
    return jsonify({
        'history': data.get('game_history', [])
    })

@app.route('/api/check', methods=['POST'])
def check_number():
    """Check if a number has been drawn"""
    data = load_data()
    number = request.json.get('number')
    
    if not number or not isinstance(number, int) or number < 1 or number > 90:
        return jsonify({'error': 'Invalid number. Must be between 1 and 90'}), 400
    
    is_drawn = number in data['drawn_numbers']
    
    return jsonify({
        'number': number,
        'drawn': is_drawn,
        'message': f'Number {number} has {"already been" if is_drawn else "not been"} drawn'
    })

# WebSocket event handlers
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    # Send current state to newly connected client
    data = load_data()
    emit('sync_state', {
        'drawn_numbers': data['drawn_numbers'],
        'total_drawn': len(data['drawn_numbers']),
        'remaining': 90 - len(data['drawn_numbers'])
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)