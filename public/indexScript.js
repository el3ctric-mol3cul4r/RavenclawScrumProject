const socket = io();

/* ---------------- Questions ---------------- */

let questions = [];
let currentQuestion = null;

/* ---------------- DOM ---------------- */

const precalcBtn = document.getElementById('precalcBtn');
const precalcSection = document.getElementById('precalcSection');
const questionSection = document.getElementById('questionSection');
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const feedback = document.getElementById('feedback');

document.getElementById('pageSwitch').onclick = () => {
  window.location.href = 'timer.html';
};

document.getElementById('leaderboardLink').onclick = () => {
  window.location.href = 'leaderboard.html';
};

document.getElementById('landingButton').onclick = () => {
  window.location.href = 'landing.html';
};

/* ---------------- CSV ---------------- */

// Proper CSV parser that still outputs SAME row format you expect
function parseCSV(text) {
  const rows = [];
  const re = /("(?:[^"]|"")*"|[^,\n]*)(,|\n|$)/g;

  let row = [];
  let match;

  while ((match = re.exec(text)) !== null) {
    let val = match[1];

    // remove surrounding quotes if present
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1).replace(/""/g, '"');
    }

    row.push(val.trim());

    // end of row
    if (match[2] === '\n' || match[2] === '') {
      if (row.length > 1 && row.some(c => c !== '')) {
        rows.push(row);
      }
      row = [];

      if (match[2] === '') break;
    }
  }

  return rows;
}

async function loadQuestionsFromCSV(file) {
  const res = await fetch(file);
  const text = await res.text();
  const rows = parseCSV(text);

  return rows.slice(1).map(row => ({
    question: row[0],
    options: [row[1], row[2], row[3], row[4]],
    explanation: row[5] || '',
    correctIndex: Number(row[6]) - 1
  }));
}

/* ---------------- Game ---------------- */

function loadQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];

  questionText.textContent = currentQuestion.question;
  optionsDiv.innerHTML = '';
  feedback.innerHTML = '';

  currentQuestion.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.style.display = 'block';
    btn.style.margin = '8px 0';

    btn.onclick = () => checkAnswer(index, btn);

    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected, button) {
  const buttons = optionsDiv.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);

  const house = document.getElementById('houseSelect').value;
  const correct = currentQuestion.correctIndex;

  buttons[correct].style.background = 'green';
  buttons[correct].style.color = 'white';

  if (selected === correct) {
    socket.emit('addPoints', {
      house,
      points: 5
    });

    feedback.innerHTML = `✅ Correct! +5 points to ${house}`;
    feedback.style.color = 'green';

    setTimeout(loadQuestion, 2000);
  } else {
    button.style.background = 'red';
    button.style.color = 'white';

    feedback.innerHTML =
      `❌ Wrong.<br>${currentQuestion.explanation}`;

    feedback.style.color = 'red';

    setTimeout(loadQuestion, 5000);
  }
}

/* ---------------- Init ---------------- */

precalcBtn.onclick = async () => {
  precalcSection.style.display = 'block';
  questionSection.style.display = 'block';

  if (questions.length === 0) {
    const [u1, u2, u3] = await Promise.all([
      loadQuestionsFromCSV('Unit1.csv'),
      loadQuestionsFromCSV('Unit2.csv'),
      loadQuestionsFromCSV('Unit3.csv')
    ]);

    questions = [...u1, ...u2, ...u3];
  }

  loadQuestion();
};