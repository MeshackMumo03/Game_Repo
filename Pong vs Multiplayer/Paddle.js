const SPEED = 0.02; // Speed constant for paddle movement

export default class Paddle {
    constructor(paddleElem) {
        this.paddleElem = paddleElem;
        this.reset(); // Initialize paddle position
    }

    // Get the current position of the paddle
    get position() {
        return parseFloat(
            getComputedStyle(this.paddleElem).getPropertyValue("--position")
        );
    }

    // Set the position of the paddle
    set position(value) {
        this.paddleElem.style.setProperty("--position", value);
    }

    // Get the bounding rectangle of the paddle
    rect() {
        return this.paddleElem.getBoundingClientRect();
    }

    // Reset the position of the paddle to the default position (50)
    reset() {
        this.position = 50;
    }

    // Update the position of the paddle based on the height of the ball and delta time
    update(delta, ballHeight) {
        // Calculate the new position of the paddle based on the ball height and delta time
        this.position += SPEED * delta * (ballHeight - this.position);
    }
}