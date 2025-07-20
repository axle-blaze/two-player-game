// Dot Duel Client
const socket = io();
let room = null;
let name = null;
let dot = null;
let scores = {};
let gameOver = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const winnerDiv = document.getElementById('winner');

function drawDot(dot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (dot) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

canvas.addEventListener('click', (e) => {
  if (!dot || gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const dist = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
  if (dist <= 20) {
    socket.emit('dot_clicked');
    dot = null;
    drawDot(null);
  }
});

document.getElementById('joinBtn').onclick = () => {
  room = document.getElementById('roomInput').value;
  name = document.getElementById('nameInput').value;
  if (room && name) {
    socket.emit('join_room', { room, name });
    document.getElementById('joinBtn').disabled = true;
  }
};

socket.on('new_dot', (data) => {
  dot = data;
  drawDot(dot);
});

socket.on('score_update', (data) => {
  scores = data;
  scoreboard.innerHTML = 'Scores:<br>' + Object.entries(scores).map(([id, score]) => `${id}: ${score}`).join('<br>');
});

socket.on('game_over', ({ winner }) => {
  gameOver = true;
  winnerDiv.textContent = `Game Over! Winner: ${winner}`;
  drawDot(null);
});
