// Dot Duel Server (Node.js + Socket.IO)
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve static files
app.use(express.static('../client'));

// Game state per room
const rooms = {};

function getRandomDot() {
  return {
    x: Math.floor(Math.random() * 600),
    y: Math.floor(Math.random() * 400)
  };
}

io.on('connection', (socket) => {
  let roomId = null;
  let playerName = null;

  socket.on('join_room', ({ room, name }) => {
    roomId = room;
    playerName = name;
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        scores: {},
        dot: null,
        dotActive: false,
        interval: null
      };
    }
    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
      rooms[roomId].scores[socket.id] = 0;
    }
    if (rooms[roomId].players.length === 2 && !rooms[roomId].interval) {
      // Start game loop
      rooms[roomId].interval = setInterval(() => {
        const dot = getRandomDot();
        rooms[roomId].dot = dot;
        rooms[roomId].dotActive = true;
        io.to(roomId).emit('new_dot', dot);
      }, 2000);
    }
    io.to(roomId).emit('score_update', rooms[roomId].scores);
  });

  socket.on('dot_clicked', () => {
    const room = rooms[roomId];
    if (room && room.dotActive) {
      room.dotActive = false;
      room.scores[socket.id] += 1;
      io.to(roomId).emit('score_update', room.scores);
      if (room.scores[socket.id] >= 10) {
        io.to(roomId).emit('game_over', { winner: socket.id });
        clearInterval(room.interval);
        delete rooms[roomId];
      }
    }
  });

  socket.on('disconnect', () => {
    if (roomId && rooms[roomId]) {
      rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);
      delete rooms[roomId].scores[socket.id];
      if (rooms[roomId].interval) {
        clearInterval(rooms[roomId].interval);
      }
      delete rooms[roomId];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Dot Duel server running on port ${PORT}`);
});
