// ── House score helpers ────────────────────────────────────────────────────
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

// ── CSV parsing ────────────────────────────────────────────────────────────
// Handles quoted fields that contain commas or newlines.
function parseCSV(text) {
    const rows = [];
    const re = /("(?:[^"]|"")*"|[^,\n]*)(,|\n|$)/g;
    let row = [];
    let match;
    while ((match = re.exec(text)) !== null) {
        let val = match[1];
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
        }
        row.push(val.trim());
        if (match[2] === '\n' || match[2] === '') {
            if (row.some(c => c !== '')) rows.push(row);
            row = [];
            if (match[2] === '') break;
        }
    }
    return rows;
}

async function loadQuestionsFromCSV(filename) {
    const response = await fetch(filename);
    const text = await response.text();
    const rows = parseCSV(text);

    // Skip header row; skip blank/incomplete rows
    return rows.slice(1)
        .filter(row => row[0] && row[1] && row[2] && row[3] && row[4] && row[6])
        .map(row => ({
            question:     row[0],
            options:      [row[1], row[2], row[3], row[4]],
            explanation:  row[5] || '',
            // Column 7 uses 1-based numbering (1–4); convert to 0-based index
            correctIndex: parseInt(row[6], 10) - 1
        }));
}

// ── Question state ─────────────────────────────────────────────────────────
let questions = [];
let currentQuestion = null;

// ── DOM refs ───────────────────────────────────────────────────────────────
if (document.getElementById('pageSwitch')) {
    document.getElementById('pageSwitch').addEventListener('click', () => {
        window.location.href = 'timer.html';
    });
}

const precalcBtn      = document.getElementById('precalcBtn');
const precalcSection  = document.getElementById('precalcSection');
const questionSection = document.getElementById('questionSection');
const questionText    = document.getElementById('questionText');
const optionsDiv      = document.getElementById('options');
const feedback        = document.getElementById('feedback');

// ── Load & display a question ──────────────────────────────────────────────
function loadQuestion() {
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionText.textContent = currentQuestion.question;
    optionsDiv.innerHTML = '';
    feedback.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.style.cssText = 'display:block; margin:8px 0;';
        button.addEventListener('click', () => checkAnswer(index, button));
        optionsDiv.appendChild(button);
    });
}

// ── Check answer, award points, show explanation ───────────────────────────
function checkAnswer(selectedIndex, clickedButton) {
    // Disable all buttons so the user can't click again
    const allButtons = optionsDiv.querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = true);

    const houseSelect = document.getElementById('houseSelect');
    const house = houseSelect ? houseSelect.value : 'ravenclaw';
    const { correctIndex, explanation, options } = currentQuestion;

    // Highlight correct answer green
    allButtons[correctIndex].style.background = '#2a7a2a';
    allButtons[correctIndex].style.color = '#fff';

    if (selectedIndex === correctIndex) {
        // ── Correct ──
        addHousePoints(house, 5);
        feedback.innerHTML = `✅ Correct! <strong>+5 points</strong> to ${capitalize(house)}.`;
        feedback.style.color = '#2a7a2a';

        setTimeout(() => {
            feedback.innerHTML = '';
            loadQuestion();
        }, 2000);

    } else {
        // ── Wrong — highlight their pick red, show explanation ──
        clickedButton.style.background = '#9b2020';
        clickedButton.style.color = '#fff';

        const correctText = options[correctIndex];
        feedback.innerHTML =
            `❌ Not quite. The correct answer is <strong>${correctText}</strong>.<br><br>` +
            `<em>${explanation}</em>`;
        feedback.style.color = '#9b2020';

        setTimeout(() => {
            feedback.innerHTML = '';
            loadQuestion();
        }, 6000); // longer delay so they can read the explanation
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Init ───────────────────────────────────────────────────────────────────
precalcBtn.addEventListener('click', async () => {
    precalcSection.style.display = 'block';
    questionSection.style.display = 'block';

    if (questions.length === 0) {
        questionText.textContent = 'Loading questions…';
        const [u1, u2, u3] = await Promise.all([
            loadQuestionsFromCSV('Unit1.csv'),
            loadQuestionsFromCSV('Unit2.csv'),
            loadQuestionsFromCSV('Unit3.csv')
        ]);
        questions = [...u1, ...u2, ...u3];
    }

    loadQuestion();
});
