if (document.getElementById("pageSwitch")){
    document.getElementById("pageSwitch").addEventListener("click", function(){window.location.href = "timer.html"})
}

if(document.getElementById("timer-display")){
    let button = document.createElement("button")
    button.innerText = "Return to home"
    document.getElementById("swap container").appendChild(button)
    button.addEventListener("click", function(){window.location.href = "index.html"}
)
}

class Question{
    constructor(answer){
        this.answer = answer
        
    }
}
    
    

class Subject{
    constructor(questions, type){
        this.questions = questions
        this.type = type
    }

    newQuestion(){
        this.display(this.questions[Math.trunc(Math.random()*this.questions.length)])
    }

    display(question){
    }
}

/*



const timer = new SharedCountdownTimer(300, 'globalGame');

// Get DOM elements
const timerDisplay = document.getElementById('timer-display');
const statusDiv = document.getElementById('status');
const gameOverModal = document.getElementById('game-over-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');

// Update timer display
function updateDisplay() {
    timerDisplay.textContent = timer.getTimeString();

    // Change color based on time remaining
    if (timer.remainingTime <= 60) {
        timerDisplay.style.color = '#ff4444'; // Red for last minute
        statusDiv.textContent = `Hurry! ${timer.remainingTime} seconds left!`;
    } else if (timer.remainingTime <= 120) {
        timerDisplay.style.color = '#ffaa00'; // Orange for last 2 minutes
        statusDiv.textContent = `Time running low! ${timer.getTimeString()} remaining`;
    } else {
        timerDisplay.style.color = '#44ff44'; // Green for normal time
        statusDiv.textContent = `Games in progress - ${timer.getTimeString()} remaining`;
    }
}

// Handle timer completion
timer.onComplete = function() {
    statusDiv.textContent = 'Game Over! Time\'s up!';
    timerDisplay.style.color = '#ff0000';
    timer.clearState(); // Clear saved state when game ends

    // Show the reset button under the timer
    resetTimerBtn.classList.remove('hidden');

    // Show the game over modal
    gameOverModal.style.display = 'block';
};

// Close modal when OK button is clicked
closeModalBtn.addEventListener('click', function() {
    gameOverModal.style.display = 'none';
});

// Reset timer and start new game when reset button is clicked
resetTimerBtn.addEventListener('click', function() {
    timer.reset();
    timer.start(); // Start the timer after resetting
    resetTimerBtn.classList.add('hidden');
    statusDiv.textContent = 'New game started!';
    timerDisplay.style.color = '#44ff44';
});

// Close modal when clicking outside the modal content
gameOverModal.addEventListener('click', function(event) {
    if (event.target === gameOverModal) {
        gameOverModal.style.display = 'none';
    }
});

// Handle timer updates
timer.onUpdate = function(remainingTime) {
    updateDisplay();
};

// Initialize display
updateDisplay();

// Always ensure timer is running when page loads
if (!timer.isRunning || timer.remainingTime <= 0) {
    if (timer.remainingTime <= 0) {
        // Timer has expired - show reset button
        statusDiv.textContent = 'Game Over! Time\'s up!';
        timerDisplay.style.color = '#ff0000';
        resetTimerBtn.classList.remove('hidden');
    } else {
        // Start the timer if it's not running
        timer.start();
        statusDiv.textContent = 'Game in progress!';
    }
}

*/