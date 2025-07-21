// Dot Duel Client
const socket = io();
let room = null;
let name = null;
let dot = null;
let scores = {};
let gameOver = false;
let joined = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const winnerDiv = document.getElementById('winner');
const statusDiv = document.getElementById('status');
const joinBox = document.getElementById('joinBox');
const joinBtn = document.getElementById('joinBtn');

function drawDot(dot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (dot) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 20, 0, 2 * Math.PI);
    ctx.shadowColor = '#2b6cb0';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'radial-gradient(circle at 60% 40%, #f56565 60%, #c53030 100%)';
    ctx.fillStyle = '#f56565';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#c53030';
    ctx.stroke();
  }
}

canvas.addEventListener('click', (e) => {
  if (!dot || gameOver || !joined) return;
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

joinBtn.onclick = () => {
  room = document.getElementById('roomInput').value.trim();
  name = document.getElementById('nameInput').value.trim();
  if (room && name) {
    socket.emit('join_room', { room, name });
    joinBtn.disabled = true;
    statusDiv.textContent = 'Waiting for another player to join...';
    joined = true;
    joinBox.style.display = 'none';
  }
};

socket.on('new_dot', (data) => {
  dot = data;
  statusDiv.textContent = 'Click the dot!';
  drawDot(dot);
});

socket.on('score_update', (data) => {
  scores = data;
  let html = '<b>Scores</b><br>';
  Object.entries(scores).forEach(([id, score], idx) => {
    html += `<span style="color:${idx===0?'#2b6cb0':'#c53030'};font-weight:bold;">Player ${idx+1}</span>: ${score}<br>`;
  });
  scoreboard.innerHTML = html;
});

socket.on('game_over', ({ winner }) => {
  gameOver = true;
  statusDiv.textContent = '';
  winnerDiv.textContent = `Game Over! Winner: ${winner}`;
  drawDot(null);
});
