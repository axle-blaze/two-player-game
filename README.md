# two-player-game
## Dot Duel

Dot Duel is a real-time two-player game where players race to click on randomly appearing dots. The first player to reach 10 points wins.

### How to Run
1. Go to the `server` directory and run `npm install` to install dependencies.
2. Start the server with `npm start`.
3. Open `client/index.html` in your browser.
4. Enter a room name and your name, then join. Have a second player join the same room.

### Technologies
- Backend: Node.js + Express + Socket.IO
- Frontend: HTML + JavaScript (Canvas)

### Gameplay
- Two players join the same room.
- A dot appears at a random location every few seconds.
- The first player to click the dot gets a point.
- The game continues until one player reaches the winning score.
- Scores and winner are shown in real time.

### Configuration
You can adjust game settings in `server/config.js`:
- `WINNING_SCORE`: Points needed to win (default: 10)
- `DOT_INTERVAL_MS`: Dot appearance interval in milliseconds (default: 2000)
- `CANVAS_WIDTH` / `CANVAS_HEIGHT`: Canvas size in pixels
- `DOT_RADIUS`: Dot size in pixels
- `MAX_PLAYERS`: Number of players per room (default: 2)

### Folder Structure
- `server/`: Node.js backend
- `client/`: Frontend files (open `index.html` in browser)

### Example
```bash
cd server
npm install
npm start
# Then open client/index.html in your browser
```
