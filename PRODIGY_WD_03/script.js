const cells = document.querySelectorAll('[data-cell]');
const statusMessage = document.getElementById('statusMessage');
const restartButton = document.getElementById('restartButton');
const winLine = document.getElementById('win-line');

let isXTurn = true;
let gameActive = true;

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left col
  [1, 4, 7], // Middle col
  [2, 5, 8], // Right col
  [0, 4, 8], // Diagonal \
  [2, 4, 6]  // Diagonal /
];

function startGame() {
  cells.forEach(cell => {
    cell.classList.remove('x', 'o');
    cell.textContent = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });

  isXTurn = true;
  gameActive = true;
  statusMessage.innerText = "Player X's Turn";
  winLine.style.width = '0';
  winLine.style.transform = '';
}

function handleClick(e) {
  if (!gameActive) return;

  const cell = e.target;
  const currentClass = isXTurn ? 'x' : 'o';
  placeMark(cell, currentClass);

  const winCombo = checkWin(currentClass);
  if (winCombo) {
    showWinLine(winCombo);
    statusMessage.innerText = `Player ${isXTurn ? 'X' : 'O'} Wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusMessage.innerText = "It's a Draw!";
    gameActive = false;
    return;
  }

  isXTurn = !isXTurn;
  statusMessage.innerText = `Player ${isXTurn ? 'X' : 'O'}'s Turn`;
}

function placeMark(cell, mark) {
  cell.classList.add(mark);
  cell.textContent = mark;
}

function checkWin(currentClass) {
  for (const combo of WINNING_COMBINATIONS) {
    if (combo.every(index => cells[index].classList.contains(currentClass))) {
      return combo;
    }
  }
  return null;
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains('x') || cell.classList.contains('o')
  );
}

function showWinLine(combo) {
  const [a, b, c] = combo;

  const cellA = cells[a].getBoundingClientRect();
  const cellC = cells[c].getBoundingClientRect();
  const boardRect = document.getElementById('board').getBoundingClientRect();

  const x1 = cellA.left + cellA.width / 2 - boardRect.left;
  const y1 = cellA.top + cellA.height / 2 - boardRect.top;
  const x2 = cellC.left + cellC.width / 2 - boardRect.left;
  const y2 = cellC.top + cellC.height / 2 - boardRect.top;

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  winLine.style.width = `${length}px`;
  winLine.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;
}

restartButton.addEventListener('click', startGame);
startGame();
