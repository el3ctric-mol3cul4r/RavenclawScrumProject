const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'));
});

/* ---------------- Shared Game State ---------------- */

let houseScores = {
  gryffindor: 0,
  hufflepuff: 0,
  ravenclaw: 0,
  slytherin: 0
};

let timerState = {
  duration: 300,
  startTime: Date.now(),
  running: true
};

function getRemainingTime() {
  if (!timerState.running) return timerState.duration;

  const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
  return Math.max(0, timerState.duration - elapsed);
}

/* ---------------- Socket.IO ---------------- */

io.on('connection', (socket) => {
  console.log('User connected');

  socket.emit('scoresUpdated', houseScores);

  socket.emit('timerUpdate', {
    remaining: getRemainingTime(),
    running: timerState.running
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('addPoints', ({ house, points }) => {
    if (houseScores[house] !== undefined) {
      houseScores[house] += points;
      io.emit('scoresUpdated', houseScores);
    }
  });

  socket.on('resetScores', () => {
    houseScores = {
      gryffindor: 0,
      hufflepuff: 0,
      ravenclaw: 0,
      slytherin: 0
    };

    io.emit('scoresUpdated', houseScores);
  });

  socket.on('startTimer', () => {
    timerState.startTime = Date.now();
    timerState.running = true;
    timerState.duration = 300;

    io.emit('timerUpdate', {
      remaining: getRemainingTime(),
      running: true
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

/* Broadcast timer every second */
setInterval(() => {
  io.emit('timerUpdate', {
    remaining: getRemainingTime(),
    running: timerState.running
  });
}, 1000);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});