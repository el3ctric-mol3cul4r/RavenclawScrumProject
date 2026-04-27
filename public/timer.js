class SharedCountdownTimer {
    constructor(durationInSeconds = 600, gameId = 'default') { 
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

    
    loadSharedState() {
        const savedState = localStorage.getItem(`sharedGame_${this.gameId}`);
        if (savedState) {
            const state = JSON.parse(savedState);
            this.gameStartTime = state.gameStartTime;
            this.duration = state.duration;

            
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
            
            this.startNewGame();
        }
    }

    
    saveSharedState() {
        const state = {
            gameStartTime: this.gameStartTime,
            duration: this.duration,
            gameId: this.gameId
        };
        localStorage.setItem(`sharedGame_${this.gameId}`, JSON.stringify(state));
    }

    
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

    
    clearState() {
        localStorage.removeItem(`sharedGame_${this.gameId}`);
    }

    
    getStatus() {
        return {
            remainingTime: this.remainingTime,
            isRunning: this.isRunning,
            gameStartTime: this.gameStartTime,
            duration: this.duration
        };
    }
}