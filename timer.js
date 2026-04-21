class SharedCountdownTimer {
    constructor(durationInSeconds = 300, gameId = 'default') { // Default 5 minutes
        this.duration = durationInSeconds;
        this.gameId = gameId;
        this.remainingTime = durationInSeconds;
        this.isRunning = false;
        this.interval = null;
        this.onUpdate = null;
        this.onComplete = null;
        this.gameStartTime = null;
        this.loadSharedState();
    }

    // Load shared game state from localStorage (fallback for when server isn't available)
    loadSharedState() {
        const savedState = localStorage.getItem(`sharedGame_${this.gameId}`);
        if (savedState) {
            const state = JSON.parse(savedState);
            this.gameStartTime = state.gameStartTime;
            this.duration = state.duration;

            // Calculate remaining time based on elapsed time since game started
            if (this.gameStartTime) {
                const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
                this.remainingTime = Math.max(0, this.duration - elapsed);

                if (this.remainingTime > 0) {
                    this.isRunning = true;
                    // Start the interval for existing running game
                    this.startInterval();
                } else {
                    this.isRunning = false;
                }
            }
        } else {
            // No saved state, start new game
            this.startNewGame();
        }
    }

    // Save shared game state
    saveSharedState() {
        const state = {
            gameStartTime: this.gameStartTime,
            duration: this.duration,
            gameId: this.gameId
        };
        localStorage.setItem(`sharedGame_${this.gameId}`, JSON.stringify(state));
    }

    // Start a new game with current timestamp
    startNewGame() {
        this.gameStartTime = Date.now();
        this.remainingTime = this.duration;
        this.isRunning = true;
        this.saveSharedState();
        this.startInterval();
    }

    startInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            this.updateRemainingTime();

            if (this.onUpdate) {
                this.onUpdate(this.remainingTime);
            }

            if (this.remainingTime <= 0) {
                this.stop();
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }, 1000);
    }

    updateRemainingTime() {
        if (this.gameStartTime) {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            this.remainingTime = Math.max(0, this.duration - elapsed);
        }
    }

    start() {
        if (!this.isRunning) {
            this.startNewGame();
        } else {
            // Game is already running, just ensure interval is active
            this.startInterval();
        }
    }

    pause() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.pause();
        this.startNewGame();
    }

    getTimeString() {
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    setDuration(seconds) {
        this.duration = seconds;
        this.saveSharedState();
    }

    // Clear shared state (useful for game reset)
    clearState() {
        localStorage.removeItem(`sharedGame_${this.gameId}`);
    }

    // Get current game status for debugging
    getStatus() {
        return {
            remainingTime: this.remainingTime,
            isRunning: this.isRunning,
            gameStartTime: this.gameStartTime,
            duration: this.duration
        };
    }
}