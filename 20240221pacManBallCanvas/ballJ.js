// main.js

// Define a constant 'size' to represent the ball's size.
const size = 30;

// Define two empty arrays 'x' and 'y' to store the ball's position.
const x = [];
const y = [];

// Define an empty array 'balls' to store all the free balls.
const balls = [];

// Define a constant 'stepSize' for the step size in each update.
const stepSize = 5;

// Define variables 'velocity_x' and 'velocity_y' to represent the ball's velocity.
let velocity_x = [];
let velocity_y = [];

// Define a variable 'gravity' to represent the gravitational force.
let gravity = 1;

// Define a function 'checkWalls' to check if the ball hits the walls.
function checkWalls(i) {
  // If the ball's x-coordinate is less than 0 or greater than 800, reverse its x-velocity.
  if (x[i] < 0 || x[i] > 800) velocity_x[i] = -velocity_x[i];
  
  // If the ball's y-coordinate is greater than 400, reverse its y-velocity and set y-coordinate to 400.
  if (y[i] > 400) {
    velocity_y[i] = -velocity_y[i];
    y[i] = 400;
  }
}

// Define a function 'update' to update the ball's position and schedule the next update.
function update() {
  // Loop through all the balls.
  for (let i = 0; i < balls.length; i++) {
    // Update the x and y coordinates of the ball.
    x[i] += velocity_x[i];
    velocity_y[i] += gravity;
    y[i] += velocity_y[i];

    // Call 'checkWalls' to check for wall collisions.
    checkWalls(i);

    // Update the ball's position by setting its 'left' and 'top' CSS properties.
    balls[i].style.left = x[i];
    balls[i].style.top = y[i];
  }

  // Use setTimeout to schedule the next update, creating an animation effect.
  setTimeout(update, 100); // This calls 'update' every 1/10 second.
}

// Define a function 'getRandom' to generate a random number scaled by the given 'scale'.
function getRandom(scale) {
  return Math.random() * scale;
}

// Define a function 'factory' to create multiple balls and add them to the 'balls' array.
function factory(total) {
  // Get the current length of the 'balls' array.
  let n = balls.length;
  
  // Loop to create the specified number of balls.
  for (let i = 0; i < total; i++) {
    // Generate random velocities.
    let velx = Math.floor(getRandom(20) - 10);
    let vely = Math.floor(getRandom(20) - 10);

    // Call 'makeBall' function to create a ball with random position, color, and velocity parameters.
    makeBall(getRandom(800), getRandom(400), "blue", velx, vely, 0);
  }
}
