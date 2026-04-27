const HOUSE_SCORES_KEY = 'houseScores';
const defaultScores = {
    gryffindor: 0,
    hufflepuff: 0,
    ravenclaw: 0,
    slytherin: 0
};

function getHouseScores() {
    const stored = localStorage.getItem(HOUSE_SCORES_KEY);
    return stored ? JSON.parse(stored) : { ...defaultScores };
}

function saveHouseScores(scores) {
    localStorage.setItem(HOUSE_SCORES_KEY, JSON.stringify(scores));
}

function addHousePoints(house, points) {
    const scores = getHouseScores();
    scores[house] = (scores[house] || 0) + points;
    saveHouseScores(scores);
}

const questions = [
    {
        question: 'What is the domain of f(x) = x + 3 / (x^2 - x - 6)?',
        options: [
            'All real numbers except x=-2',
            'All real numbers except x=3 and x=-2',
            'All real numbers except x=3',
            'All real numbers'
        ],
        correctIndex: 1
    },
    {
        question: 'Find the average rate of change of g(x)=x/(x^2-1) from x=2 to x=4.',
        options: ['-1/2', '-3/5', '-1/3', '-1/5'],
        correctIndex: 3
    }
];

if (document.getElementById("pageSwitch")) {
    document.getElementById("pageSwitch").addEventListener("click", function() {
        window.location.href = "timer.html";
    });
}

const precalcBtn = document.getElementById('precalcBtn');
const precalcSection = document.getElementById('precalcSection');
const questionSection = document.getElementById('questionSection');
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');

function loadQuestion() {
    const item = questions[Math.floor(Math.random() * questions.length)];
    questionText.textContent = item.question;
    optionsDiv.innerHTML = '';
    item.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.style.display = 'block';
        button.style.margin = '8px 0';
        button.addEventListener('click', () => checkAnswer(index, item.correctIndex));
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selected, correctIndex) {
    const houseSelect = document.getElementById('houseSelect');
    const house = houseSelect ? houseSelect.value : 'ravenclaw';

    if (selected === correctIndex) {
        feedback.textContent = 'Correct! +5 points to ' + house + '.';
        addHousePoints(house, 5);
        setTimeout(() => {
            feedback.textContent = '';
            loadQuestion();
        }, 1800);
    } else {
        feedback.textContent = 'Wrong answer. Moving to the next question.';
        setTimeout(() => {
            feedback.textContent = '';
            loadQuestion();
        }, 600);
    }
}

precalcBtn.addEventListener('click', () => {
    precalcSection.style.display = 'block';
    questionSection.style.display = 'block';
    loadQuestion();
});