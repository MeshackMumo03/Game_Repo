// Constant variables to represent X and circle
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

// Winning combinations for the game
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

// Selecting all the cells on the board
const cellElements = document.querySelectorAll('[data-cell]');

// Getting the board and winning message elements
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');

// Restart button
const restartButton = document.getElementById('restartButton');

// Current turn, initially set to false as X starts first
let circleTurn = false;

// Start the game
startGame();

// Event listener for restart button click
restartButton.addEventListener('click', startGame);

// Start the game function
function startGame() {
    // Reset the turn to X and remove all class names from the cells
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        // Add event listener to each cell to handle click events
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    // Set the hover class for the board
    setBoardHoverClass();
    // Hide the winning message
    winningMessageElement.classList.remove('show');
}

// Handle click event on a cell
function handleClick(e) {
    // Get the clicked cell
    const cell = e.target;
    // Determine the current turn
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    // Place the mark on the cell
    placeMark(cell, currentClass);
    // Check if there is a win
    if (checkWin(currentClass)) {
        endGame(false);
        // Check if it is a draw
    } else if (isDraw()) {
        endGame(true);
        // If not a win or draw, swap turns and set hover class for board
    } else {
        swapTurns();
        setBoardHoverClass();
        // If the AI is the current turn, trigger AI move after a 0.5s delay
        if (circleTurn) {
            setTimeout(() => {
                aiMove();
            }, 500);
        }
    }
}

// End the game
function endGame(draw) {
    // Display the appropriate message for a win or draw
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    // Show the winning message
    winningMessageElement.classList.add('show');
}

// Check if it is a draw
function isDraw() {
    // Check if every cell has a mark
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });

}

// Place the mark on the cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

// Swap turns
function swapTurns() {
    circleTurn = !circleTurn;
}

//

// Set the hover class for the board
function setBoardHoverClass() {
    // Remove the existing hover class and add the appropriate class based on the current turn
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

// Check if there is a win
function checkWin(currentClass) {
    // Check if any of the winning combinations have all cells marked with the current class
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

// AI move
function aiMove() {
    // Choose a random cell that has not already been marked
    const randomIndex = Math.floor(Math.random() * cellElements.length);
    const cell = cellElements[randomIndex];
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    // Place the mark on the cell
    placeMark(cell, currentClass);
    // Check if there is a win
    if (checkWin(currentClass)) {
        endGame(false);
        // Check if it is a draw
    } else if (isDraw()) {
        endGame(true);
        // If not a win or draw, swap turns and set hover class for board
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}