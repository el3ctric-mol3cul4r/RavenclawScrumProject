
if(document.getElementById("timer-display")){
    let button = document.createElement("button")
    button.innerText = "Return to home"
    document.getElementById("swap container").appendChild(button)
    button.addEventListener("click", function(){window.location.href = "index.html"}
)
}




const timer = new SharedCountdownTimer(300, 'globalGame');

// Get DOM elements
const timerDisplay = document.getElementById('timer-display');
const statusDiv = document.getElementById('status');
const gameOverModal = document.getElementById('game-over-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');


// Question Class
class Question {
    constructor(text, answer, points) {
        this.text = text;
        this.answer = answer;
        this.answer = answer
    }   
}

// Update timer display
function updateDisplay() {
    timerDisplay.textContent = timer.getTimeString();

    if (timer.remainingTime <= 60) {
        timerDisplay.style.color = '#ff4444';
    } else if (timer.remainingTime <= 120) {
        timerDisplay.style.color = '#ffaa00';
    } else {
        timerDisplay.style.color = '#44ff44';
    }
}


timer.onComplete = function() {
    timerDisplay.style.color = '#ff0000';
    timer.clearState();

    // Show the reset button under the timer
    resetTimerBtn.classList.remove('hidden');

    gameOverModal.style.display = 'block';
};


closeModalBtn.addEventListener('click', function() {
    gameOverModal.style.display = 'none';
});


resetTimerBtn.addEventListener('click', function() {
    timer.reset();
    timer.start(); 
    resetTimerBtn.classList.add('hidden');
    timerDisplay.style.color = '#44ff44';
});


gameOverModal.addEventListener('click', function(event) {
    if (event.target === gameOverModal) {
        gameOverModal.style.display = 'none';
    }
});


timer.onUpdate = function(remainingTime) {
    updateDisplay();
};


updateDisplay();


if (!timer.isRunning || timer.remainingTime <= 0) {
    if (timer.remainingTime <= 0) {
        
        timerDisplay.style.color = '#ff0000';
        resetTimerBtn.classList.remove('hidden');
    } else {
       
        timer.start();
    }
}
