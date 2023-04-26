// Set initial values for the ball's velocity and increase rate
const INITIAL_VELOCITY = 0.025
const VELOCITY_INCREASE = 0.00001

export default class Ball {
    constructor(ballElem) {
        this.ballElem = ballElem
        this.reset() // Initialize the ball's position and direction
    }

    // Getters and setters for the ball's x and y positions
    get x() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"))
    }

    set x(value) {
        this.ballElem.style.setProperty("--x", value)
    }

    get y() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"))
    }

    set y(value) {
        this.ballElem.style.setProperty("--y", value)
    }

    // Returns the ball's position and dimensions as a DOMRect object
    rect() {
        return this.ballElem.getBoundingClientRect()
    }

    // Resets the ball's position and direction
    reset() {
        this.x = 50
        this.y = 50
        this.direction = { x: 0 }
            // Randomize the ball's direction, avoiding angles too close to the x-axis
        while (
            Math.abs(this.direction.x) <= 0.2 ||
            Math.abs(this.direction.x) >= 0.9
        ) {
            const heading = randomNumberBetween(0, 2 * Math.PI)
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
        }
        this.velocity = INITIAL_VELOCITY // Set the ball's velocity to its initial value
    }

    // Updates the ball's position and velocity based on time elapsed and paddle collisions
    update(delta, paddleRects) {
        this.x += this.direction.x * this.velocity * delta
        this.y += this.direction.y * this.velocity * delta
        this.velocity += VELOCITY_INCREASE * delta // Increase the ball's velocity over time
        const rect = this.rect()

        // Reverse the ball's vertical direction if it hits the top or bottom of the screen
        if (rect.bottom >= window.innerHeight || rect.top <= 0) {
            this.direction.y *= -1
        }

        // Reverse the ball's horizontal direction if it collides with any of the paddle rectangles
        if (paddleRects.some(r => isCollision(r, rect))) {
            this.direction.x *= -1
        }
    }
}

// Helper function to generate a random number within a given range
function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min
}

// Helper function to check for collision between two rectangles
function isCollision(rect1, rect2) {
    return (
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left &&
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top
    )
}