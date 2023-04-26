// Import Ball and Paddle classes from separate modules
import Ball from "./Ball.js"
import Paddle from "./Paddle.js"

// Instantiate game objects and get score elements from the DOM
const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")

// Keep track of the last update time
let lastTime

// Function to update the game state
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime
            // Update ball and computer paddle based on delta time and ball position
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
        computerPaddle.update(delta, ball.y)
            // Update game background color
        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
        )
        document.documentElement.style.setProperty("--hue", hue + delta * 0.01)

        // Check if the ball has gone out of bounds and handle loss accordingly
        if (isLose()) handleLose()
    }

    // Update lastTime and call update function again
    lastTime = time
    window.requestAnimationFrame(update)
}

// Function to check if the ball has gone out of bounds
function isLose() {
    const rect = ball.rect()
    return rect.right >= window.innerWidth || rect.left <= 0
}

// Function to handle loss by incrementing the score and resetting game objects
function handleLose() {
    const rect = ball.rect()
    if (rect.right >= window.innerWidth) {
        playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
    } else {
        computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
    }
    ball.reset()
    computerPaddle.reset()
}

// Event listener to update player paddle position based on mouse position
document.addEventListener("mousemove", e => {
    playerPaddle.position = (e.y / window.innerHeight) * 100
})

// Call update function repeatedly to update and render the game
window.requestAnimationFrame(update)