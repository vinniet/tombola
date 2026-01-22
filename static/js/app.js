// Tombola Number Tracker - Main JavaScript with Real-Time Sync

class TombolaTracker {
    constructor() {
        this.drawnNumbers = [];
        this.socket = null;
        this.voiceEnabled = false;
        this.italianNumbers = {
            1: 'uno', 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque',
            6: 'sei', 7: 'sette', 8: 'otto', 9: 'nove', 10: 'dieci',
            11: 'undici', 12: 'dodici', 13: 'tredici', 14: 'quattordici', 15: 'quindici',
            16: 'sedici', 17: 'diciassette', 18: 'diciotto', 19: 'diciannove', 20: 'venti',
            21: 'ventuno', 22: 'ventidue', 23: 'ventitré', 24: 'ventiquattro', 25: 'venticinque',
            26: 'ventisei', 27: 'ventisette', 28: 'ventotto', 29: 'ventinove', 30: 'trenta',
            31: 'trentuno', 32: 'trentadue', 33: 'trentatré', 34: 'trentaquattro', 35: 'trentacinque',
            36: 'trentasei', 37: 'trentasette', 38: 'trentotto', 39: 'trentanove', 40: 'quaranta',
            41: 'quarantuno', 42: 'quarantadue', 43: 'quarantatré', 44: 'quarantaquattro', 45: 'quarantacinque',
            46: 'quarantasei', 47: 'quarantasette', 48: 'quarantotto', 49: 'quarantanove', 50: 'cinquanta',
            51: 'cinquantuno', 52: 'cinquantadue', 53: 'cinquantatré', 54: 'cinquantaquattro', 55: 'cinquantacinque',
            56: 'cinquantasei', 57: 'cinquantasette', 58: 'cinquantotto', 59: 'cinquantanove', 60: 'sessanta',
            61: 'sessantuno', 62: 'sessantadue', 63: 'sessantatré', 64: 'sessantaquattro', 65: 'sessantacinque',
            66: 'sessantasei', 67: 'sessantasette', 68: 'sessantotto', 69: 'sessantanove', 70: 'settanta',
            71: 'settantuno', 72: 'settantadue', 73: 'settantatré', 74: 'settantaquattro', 75: 'settantacinque',
            76: 'settantasei', 77: 'settantasette', 78: 'settantotto', 79: 'settantanove', 80: 'ottanta',
            81: 'ottantuno', 82: 'ottantadue', 83: 'ottantatré', 84: 'ottantaquattro', 85: 'ottantacinque',
            86: 'ottantasei', 87: 'ottantasette', 88: 'ottantotto', 89: 'ottantanove', 90: 'novanta'
        };
        this.init();
    }

    init() {
        this.initSocket();
        this.createNumberBoard();
        this.attachEventListeners();
        this.loadStatus();
    }

    initSocket() {
        // Initialize Socket.IO connection
        this.socket = io();

        // Handle connection
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Handle initial state sync
        this.socket.on('sync_state', (data) => {
            console.log('Syncing state:', data);
            this.drawnNumbers = data.drawn_numbers;
            this.updateStats(data.total_drawn, data.remaining);
            this.updateBoard();
            this.updateRecentNumbers();
        });

        // Handle number drawn by another client
        this.socket.on('number_drawn', (data) => {
            console.log('Number drawn:', data);
            this.drawnNumbers = data.drawn_numbers;
            this.updateStats(data.total_drawn, data.remaining);
            this.updateBoard();
            this.updateRecentNumbers();
            this.playDrawAnimation(data.number);
            this.showNumberPopup(data.number);
        });

        // Handle game reset by another client
        this.socket.on('game_reset', (data) => {
            console.log('Game reset');
            this.drawnNumbers = data.drawn_numbers;
            this.updateStats(data.total_drawn, data.remaining);
            this.updateBoard();
            this.updateRecentNumbers();
            this.showMessage('Game has been reset', 'info');
        });

        // Handle undo by another client
        this.socket.on('number_undone', (data) => {
            console.log('Number undone:', data);
            this.drawnNumbers = data.drawn_numbers;
            this.updateStats(data.total_drawn, data.remaining);
            this.updateBoard();
            this.updateRecentNumbers();
        });

        // Handle disconnection
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.showMessage('Connection lost. Reconnecting...', 'error');
        });

        // Handle reconnection
        this.socket.on('reconnect', () => {
            console.log('Reconnected to server');
            this.showMessage('Reconnected!', 'success');
            this.loadStatus();
        });
    }

    createNumberBoard() {
        const board = document.getElementById('number-board');
        board.innerHTML = '';
        
        for (let i = 1; i <= 90; i++) {
            const cell = document.createElement('div');
            cell.className = 'number-cell';
            cell.textContent = i;
            cell.dataset.number = i;
            cell.addEventListener('click', () => this.drawNumber(i));
            board.appendChild(cell);
        }
    }

    attachEventListeners() {
        // Random draw button
        document.getElementById('random-draw-btn').addEventListener('click', () => {
            this.randomDraw();
        });

        // Keyboard shortcuts: R key or Spacebar for random draw
        document.addEventListener('keydown', (e) => {
            // Check if R key or Spacebar is pressed and not in an input field
            if (((e.key === 'r' || e.key === 'R' || e.key === ' ') &&
                e.target.tagName !== 'INPUT' &&
                e.target.tagName !== 'TEXTAREA')) {
                e.preventDefault();
                this.randomDraw();
            }
        });

        // Voice toggle button
        document.getElementById('voice-toggle-btn').addEventListener('click', () => {
            this.toggleVoice();
        });

        // Undo button
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undoLast();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game? This will clear all drawn numbers.')) {
                this.resetGame();
            }
        });

        // Check button
        document.getElementById('check-btn').addEventListener('click', () => {
            this.showCheckModal();
        });

        // History button
        document.getElementById('history-btn').addEventListener('click', () => {
            this.showHistory();
        });

        // Check submit button
        document.getElementById('check-submit-btn').addEventListener('click', () => {
            const number = parseInt(document.getElementById('check-input').value);
            if (number) {
                this.checkNumber(number);
            }
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    async drawNumber(number) {
        try {
            const response = await fetch('/api/draw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ number })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage(`Number ${number} drawn successfully!`, 'success');
                this.showNumberPopup(number);
                // State will be updated via WebSocket
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error drawing number: ' + error.message, 'error');
        }
    }

    async randomDraw() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            if (data.available_numbers.length === 0) {
                this.showMessage('All numbers have been drawn!', 'info');
                return;
            }

            // Pick a random number from available numbers
            const randomIndex = Math.floor(Math.random() * data.available_numbers.length);
            const randomNumber = data.available_numbers[randomIndex];
            
            // Draw the random number
            await this.drawNumber(randomNumber);
        } catch (error) {
            this.showMessage('Error with random draw: ' + error.message, 'error');
        }
    }

    async loadStatus() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();

            this.drawnNumbers = data.drawn_numbers;
            this.updateStats(data.total_drawn, data.remaining);
            this.updateBoard();
            this.updateRecentNumbers();
        } catch (error) {
            this.showMessage('Error loading status: ' + error.message, 'error');
        }
    }

    updateStats(drawn, remaining) {
        document.getElementById('drawn-count').textContent = drawn;
        document.getElementById('remaining-count').textContent = remaining;
    }

    updateBoard() {
        const cells = document.querySelectorAll('.number-cell');
        cells.forEach(cell => {
            const number = parseInt(cell.dataset.number);
            if (this.drawnNumbers.includes(number)) {
                cell.classList.add('drawn');
            } else {
                cell.classList.remove('drawn');
            }
        });
    }

    updateRecentNumbers() {
        const container = document.getElementById('recent-numbers');
        
        if (this.drawnNumbers.length === 0) {
            container.innerHTML = '<span class="empty-state">None</span>';
            return;
        }

        // Show all drawn numbers with most recent on the left
        const recentNumbers = [...this.drawnNumbers].reverse();
        
        container.innerHTML = recentNumbers.map(num =>
            `<div class="recent-number">${num}</div>`
        ).join('');
    }

    playDrawAnimation(number) {
        const cell = document.querySelector(`.number-cell[data-number="${number}"]`);
        if (cell) {
            cell.classList.add('drawn');
        }
    }

    async undoLast() {
        try {
            const response = await fetch('/api/undo', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage(`Undone: Number ${data.undone_number}`, 'info');
                // State will be updated via WebSocket
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error undoing: ' + error.message, 'error');
        }
    }

    async resetGame() {
        try {
            const response = await fetch('/api/reset', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Game reset successfully!', 'success');
                // State will be updated via WebSocket
            } else {
                this.showMessage('Error resetting game', 'error');
            }
        } catch (error) {
            this.showMessage('Error resetting game: ' + error.message, 'error');
        }
    }

    async checkNumber(number) {
        try {
            const response = await fetch('/api/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ number })
            });

            const data = await response.json();

            if (response.ok) {
                const resultDiv = document.getElementById('check-result');
                resultDiv.textContent = data.message;
                resultDiv.className = data.drawn ? 'drawn' : 'not-drawn';
            } else {
                this.showMessage(data.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error checking number: ' + error.message, 'error');
        }
    }

    showCheckModal() {
        const modal = document.getElementById('check-modal');
        modal.classList.add('show');
        document.getElementById('check-input').value = '';
        document.getElementById('check-result').textContent = '';
        document.getElementById('check-result').className = '';
    }

    async showHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();

            const historyList = document.getElementById('history-list');
            
            if (data.history.length === 0) {
                historyList.innerHTML = '<p class="empty-state">No game history yet</p>';
            } else {
                historyList.innerHTML = data.history.reverse().map(game => {
                    const date = new Date(game.date);
                    const formattedDate = date.toLocaleString();
                    
                    return `
                        <div class="history-item">
                            <h3>${formattedDate}</h3>
                            <p>Numbers drawn: ${game.numbers_drawn}</p>
                            <div class="history-numbers">
                                ${game.numbers.map(num => 
                                    `<span class="history-number">${num}</span>`
                                ).join('')}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            document.getElementById('history-modal').classList.add('show');
        } catch (error) {
            this.showMessage('Error loading history: ' + error.message, 'error');
        }
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type} show`;

        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 15000);
    }

    showNumberPopup(number) {
        const popup = document.getElementById('number-popup');
        const popupNumber = document.getElementById('popup-number');
        
        // Set the number
        popupNumber.textContent = number;
        
        // Show the popup
        popup.classList.add('show');
        
        // Announce the number if voice is enabled
        if (this.voiceEnabled) {
            this.announceNumber(number);
        }
        
        // Hide after 10 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 10000);
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const icon = document.getElementById('voice-icon');
        const btn = document.getElementById('voice-toggle-btn');
        
        if (this.voiceEnabled) {
            icon.textContent = '🔊';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-success');
            this.showMessage('Voice announcements enabled', 'success');
        } else {
            icon.textContent = '🔇';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-secondary');
            this.showMessage('Voice announcements disabled', 'info');
        }
    }

    announceNumber(number) {
        // Check if speech synthesis is supported
        if (!('speechSynthesis' in window)) {
            console.log('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Get Italian word for the number
        const italianWord = this.italianNumbers[number];

        // Announce in Italian first
        const italianUtterance = new SpeechSynthesisUtterance(italianWord);
        italianUtterance.lang = 'it-IT';
        italianUtterance.rate = 0.9;
        italianUtterance.pitch = 1.0;
        italianUtterance.volume = 1.0;

        // Announce in English after Italian
        italianUtterance.onend = () => {
            setTimeout(() => {
                const englishUtterance = new SpeechSynthesisUtterance(number.toString());
                englishUtterance.lang = 'en-US';
                englishUtterance.rate = 0.9;
                englishUtterance.pitch = 1.0;
                englishUtterance.volume = 1.0;
                window.speechSynthesis.speak(englishUtterance);
            }, 300); // Small pause between languages
        };

        window.speechSynthesis.speak(italianUtterance);
    }
}

// Initialize the tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TombolaTracker();
});