const PLAYER_CLASS = 'x';
const AI_CLASS = 'circle';
const DRAW_MESSAGE = 'Draw!';
const WIN_MESSAGE = ' Wins!';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

let aiLevel = 1;
let aiTurn = false;
let gameOver = false;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    aiTurn = false;
    gameOver = false;
    cells.forEach(cell => {
        cell.classList.remove(PLAYER_CLASS, AI_CLASS);
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    board.classList.remove(PLAYER_CLASS, AI_CLASS);
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleCellClick(e) {
    if (gameOver) return;
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);
    if (index === -1) {
        console.error('Invalid cell index:', index);
        return;
    }
    if (cell.classList.contains(PLAYER_CLASS) || cell.classList.contains(AI_CLASS)) {
        console.error('Cell already marked:', cell);
        return;
    }
    placeMark(cell, PLAYER_CLASS);
    if (checkWin(PLAYER_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        aiTurn = true;
        setBoardHoverClass();
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}

function endGame(draw) {
    gameOver = true;
    if (draw) {
        winningMessageTextElement.innerText = DRAW_MESSAGE;
    } else {
        const winner = aiTurn ? 'AI' : 'Player';
        winningMessageTextElement.innerText = winner + WIN_MESSAGE;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(PLAYER_CLASS) || cell.classList.contains(AI_CLASS);
    });
}

function placeMark(cell, className) {
    cell.classList.add(className

    );
}

function checkWin(className) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(className);
        });
    });
}

function setBoardHoverClass() {
    board.classList.remove(PLAYER_CLASS, AI_CLASS);
    if (aiTurn) {
        board.classList.add(AI_CLASS);
    } else {
        board.classList.add(PLAYER_CLASS);
    }
}

function aiMove() {
    const emptyCells = [...cells].filter(cell => !cell.classList.contains(PLAYER_CLASS) && !cell.classList.contains(AI_CLASS));
    if (emptyCells.length === 0) return;
    let cellIndex;
    if (aiLevel === 1) {
        cellIndex = getRandomEmptyCellIndex(emptyCells);
    } else if (aiLevel === 2) {
        cellIndex = getBestMoveIndex(emptyCells);
    }
    const cell = cells[cellIndex];
    placeMark(cell, AI_CLASS);
    if (checkWin(AI_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        aiTurn = false;
        setBoardHoverClass();
    }
}

function getRandomEmptyCellIndex(emptyCells) {
    return Math.floor(Math.random() * emptyCells.length);
}

function getBestMoveIndex(emptyCells) {
    let bestMoveIndex;
    let highestScore = -Infinity;
    emptyCells.forEach(cell => {
        const index = Array.from(cells).indexOf(cell);
        const score = minimax(index, false);
        if (score > highestScore) {
            highestScore = score;
            bestMoveIndex = index;
        }
    });
    return bestMoveIndex;
}

function minimax(index, isMaximizingPlayer) {
    const depth = [...cells].filter(cell => cell.classList.contains(PLAYER_CLASS) || cell.classList.contains(AI_CLASS)).length;
    const className = isMaximizingPlayer ? AI_CLASS : PLAYER_CLASS;
    if (checkWin(PLAYER_CLASS)) {
        return -10 + depth;
    } else if (checkWin(AI_CLASS)) {
        return 10 - depth;
    } else if (isDraw()) {
        return 0;
    }
    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        const emptyCells = [...cells].filter(cell => !cell.classList.contains(PLAYER_CLASS) && !cell.classList.contains(AI_CLASS));
        emptyCells.forEach(cell => {
            const index = Array.from(cells).indexOf(cell);
            const score = minimax(index, false);
            bestScore = Math.max(bestScore, score);
        });
        return bestScore - depth;
    } else {
        let bestScore = Infinity;
        const emptyCells = [...cells].filter(cell => !cell.classList.contains(PLAYER_CLASS) && !cell.classList.contains(AI_CLASS));
        emptyCells.forEach(cell => {
            const index = Array.from(cells).indexOf(cell);
            const score = minimax(index, true);
            bestScore = Math.min(bestScore, score);
        });
        return bestScore + depth;
    }
}