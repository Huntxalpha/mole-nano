// JavaScript logic for Mole Nano game

// Select elements
const grid = document.getElementById('grid');
const startOverlay = document.getElementById('start-overlay');
const endOverlay = document.getElementById('end-overlay');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const shareButton = document.getElementById('share-button');
const scoreEl = document.getElementById('score');

// State variables
let score = 0;
let gameActive = false;
let moleTimeout;
let gameTimer;
let holes = [];

// Create 9 holes with moles
function initGrid() {
  holes = [];
  // Clear existing children just in case
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    const mole = document.createElement('div');
    mole.classList.add('mole');
    hole.appendChild(mole);
    // Add click listener on hole
    hole.addEventListener('click', () => {
      if (!gameActive) return;
      // Only register hit if mole is up
      if (hole.classList.contains('up')) {
        score++;
        scoreEl.textContent = score;
        hideMole(hole);
      }
    });
    grid.appendChild(hole);
    holes.push(hole);
  }
}

// Show the mole by adding class 'up'
function showMole(hole) {
  hole.classList.add('up');
}

// Hide the mole by removing class 'up'
function hideMole(hole) {
  hole.classList.remove('up');
}

// Random time between min and max
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Get a random hole that is not currently active
function randomHole() {
  const idx = Math.floor(Math.random() * holes.length);
  return holes[idx];
}

// Recursive function to pop up moles at random intervals
function peep() {
  const time = randomTime(500, 1000); // mole visible duration
  const hole = randomHole();
  showMole(hole);
  moleTimeout = setTimeout(() => {
    hideMole(hole);
    if (gameActive) {
      peep();
    }
  }, time);
}

// Start the game
function startGame() {
  score = 0;
  scoreEl.textContent = score;
  gameActive = true;
  startOverlay.style.display = 'none';
  endOverlay.style.display = 'none';
  peep();
  // End game after 30 seconds
  gameTimer = setTimeout(() => {
    endGame();
  }, 30000);
}

// End the game
function endGame() {
  gameActive = false;
  clearTimeout(gameTimer);
  clearTimeout(moleTimeout);
  // Hide any active moles
  holes.forEach(hideMole);
  // Show score on end overlay
  document.getElementById('final-score').textContent = score;
  endOverlay.style.display = 'flex';
  // Update share link
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`J'ai marqué ${score} points sur #MoleNano ! Essaie de battre mon score !`);
  shareButton.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

// Reset and show start overlay
function resetGame() {
  clearTimeout(gameTimer);
  clearTimeout(moleTimeout);
  holes.forEach(hideMole);
  score = 0;
  scoreEl.textContent = score;
  startOverlay.style.display = 'flex';
  endOverlay.style.display = 'none';
}

// Initialize grid and attach start handlers once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initGrid();
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', () => {
    resetGame();
    startGame();
  });
});
