// Wait for the DOM to be fully loaded before executing the script
// This ensures that all elements referenced in the script are available before any code is executed.
document.addEventListener("DOMContentLoaded", function() {
    // Get references to DOM elements
    const container = document.getElementById("container");
    const ballCountInput = document.getElementById("ballCount");
    const buttonCreate = document.getElementById("buttonCreate");
    const buttonAccelerate = document.getElementById("buttonAccelerate");
    const buttonDecelerate = document.getElementById("buttonDecelerate");
    const buttonFloat = document.getElementById("buttonFloat");
    const buttonGravity = document.getElementById("buttonGravity");
    const buttonGenMouse = document.getElementById("buttonGenMouse");
    const buttonTrack = document.getElementById("buttonTrack");
    const buttonRandom = document.getElementById("buttonRandom");
    
    // Variable Initialization
    // balls: An array to store the ball objects
    // ballPaths: An array to store the paths of each ball for tracking movement
    // animationId: A variable to store the ID of the animation frame
    // gravityEnabled: A flag to indicate whether gravity effect is enabled
    // enableMouseCreation: A flag to enable or disable ball creation on mouse click
    // trackBallMovement: A flag to enable or disable tracking of ball movement
    // enableRandomWalk: A flag to enable or disable random walk effect for balls
    let balls = [];
    let ballPaths = [];
    let animationId = null;
    let gravityEnabled = false;
    let enableMouseCreation = false;
    let trackBallMovement = false;
    let enableRandomWalk = false;

    let randomWalkStepCount = 0;
    let maxRandomWalkSteps = 100; // Maximum steps after which speed and direction may change
    let randomWalkProbability = 0.05;
    let disableRandomWalkTemporarily = false;
    let disableRandomWalkCounter = 0;
    const disableRandomWalkDuration = 60; // Number of frames to disable random walk after acceleration/deceleration



    // Function to create a new ball with random properties
    function createBall(xPos = null, yPos = null) {
        // Generate a random size for the ball
        const size = getRandomSize(10, 60);

        // Determine the position of the ball
        let position;
        if (xPos !== null && yPos !== null) {
            position = { x: xPos, y: yPos };  // Use provided position if available
        } else {
            position = getRandomPosition(size);  // Otherwise, generate a random position
        }

        // Create the ball element and set its properties
        const ball = document.createElement("div");
        ball.className = "ball";
        ball.style.backgroundColor = getRandomColor();
        ball.style.width = size + 'px';
        ball.style.height = size + 'px';
        ball.style.left = position.x + 'px';
        ball.style.top = position.y + 'px';

        // Assign random velocities to the ball
        ball.velocityX = getRandomVelocity();
        ball.velocityY = getRandomVelocity();

        // Add the ball to the container
        container.appendChild(ball);
        return ball;
    }

    // Function to create a new ball at the position of a mouse click
    document.addEventListener("mousedown", function(e) {
        if (enableMouseCreation) {
            // Create a new ball at the mouse click position
            const newBall = createBall(e.clientX, e.clientY);

            // Adjust the position to center the ball at the click
            newBall.x = e.clientX - newBall.offsetWidth / 2;
            newBall.y = e.clientY - newBall.offsetHeight / 2;
            newBall.style.left = newBall.x + 'px';
            newBall.style.top = newBall.y + 'px';

            // Add the new ball to the balls array
            balls.push(newBall);

            // Initialize the path for the new ball if tracking is enabled
            if (trackBallMovement) {
                ballPaths.push([]);
            }
        }
    });
    // Function to create a trail element for a ball
    function createTrailElement(ball) {
        const trail = ball.cloneNode(true); // Clone the ball element
        trail.style.opacity = 0.5; // Set initial opacity to semi-transparent
        container.appendChild(trail);
    
        // Gradually fade out the trail element
        let fadeEffect = setInterval(function () {
            if (trail.style.opacity > 0) {
                trail.style.opacity -= 0.01;
            } else {
                clearInterval(fadeEffect);
                container.removeChild(trail); // Remove the trail element once fully faded
            }
        }, 50);
    }

    // Functions to generate random values for size, position, velocity, and color
    function getRandomSize(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomPosition(size) {
        return {
            x: Math.random() * (container.clientWidth - size),
            y: Math.random() * (container.clientHeight - size)
        };
    }

    function getRandomVelocity() {
        return Math.random() * 5 - 2.5; // Range: -2.5 to 2.5
    }

    function getRandomVelocityChange() {
        //return Math.random() * 2 - 1; // Generates a random value between -1 and 1
        return Math.random() * 4 - 2; // 生成一个在-2到2之间的随机值
    }

    function getRandomColor() {
        // Generates a random RGB color
        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }

    // Update function to animate the balls
    function updateBalls() {
        balls.forEach(function(ball) {
            // 在漫步概率下进行速度和方向更改//需要改进
            if (enableRandomWalk && Math.random() < randomWalkProbability) {
                // 平滑速度和方向更改，使用插值
                const velocityChangeX = getRandomVelocityChange();
                const velocityChangeY = getRandomVelocityChange();
                ball.velocityX += velocityChangeX;
                ball.velocityY += velocityChangeY;
            }
            
            if (disableRandomWalkTemporarily) {
                disableRandomWalkCounter--;
                if (disableRandomWalkCounter <= 0) {
                    disableRandomWalkTemporarily = false;
                }
            }
            
            // Apply gravity effect if enabled
            if (gravityEnabled) {
                ball.velocityY += 0.1; // Gradually accelerates the ball downward
            }

            // Create a trail element at regular intervals if tracking is enabled
            if (trackBallMovement && animationId % 10 === 0) { // Adjust the interval as needed
                createTrailElement(ball);
            }

            // Update ball position based on its velocity
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            ball.style.left = ball.x + 'px';
            ball.style.top = ball.y + 'px';

            // Check for collisions with the container walls
            checkWall(ball);
        });

        // Request the next animation frame
        animationId = requestAnimationFrame(updateBalls);
        // The recentlyAdjustedSpeed flag seems unused and can be removed
        // recentlyAdjustedSpeed = false;
    }
    // Check for collisions with the container walls
    function checkWall(ball) {
        if (ball.x < 0 || ball.x + ball.offsetWidth > container.clientWidth) {
            ball.velocityX *= -1; // Reverse direction on X-axis
            ball.style.backgroundColor = getRandomColor(); // Change color on collision
        }
        if (ball.y < 0 || ball.y + ball.offsetHeight > container.clientHeight) {
            ball.velocityY *= -1; // Reverse direction on Y-axis
            ball.style.backgroundColor = getRandomColor(); // Change color on collision
        }
    }

    // Handle window resizing
    function handleResize() {
        // Adjust ball positions to stay within the container
        balls.forEach(function(ball) {
            ball.x = Math.min(ball.x, container.clientWidth - ball.offsetWidth);
            ball.y = Math.min(ball.y, container.clientHeight - ball.offsetHeight);
        });
        // Restart animation after resizing
        cancelAnimationFrame(animationId);
        updateBalls();
    }

    // Function to create the specified number of balls
    function createBalls(count) {
        // Clear existing balls from the container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    
        // Reset the balls array and their corresponding paths
        balls = [];
        ballPaths = [];
    
        // Create specified number of balls and initialize their properties
        for (let i = 0; i < count; i++) {
            const newBall = createBall();
            newBall.x = parseFloat(newBall.style.left);
            newBall.y = parseFloat(newBall.style.top);
    
            // Add the new ball to the balls array
            balls.push(newBall);

            // Initialize the path for the new ball
            ballPaths.push([]);
        }
    }
    
    // Event listeners for buttons and window resize
    buttonCreate.addEventListener("click", function() {
        // Validate the input for creating balls
        const ballCount = parseInt(ballCountInput.value, 10);
        if (!isNaN(ballCount) && ballCount > 0 && ballCount < 1000) { // Example range check
            cancelAnimationFrame(animationId);
            createBalls(ballCount);
            updateBalls();
        } else {
            // Provide user feedback for invalid input
            alert("Please enter a valid number of balls (1 - 999).");
        }
    });

    // ...remaining event listeners for buttons...
    buttonTrack.addEventListener("click", function() {
        // Toggle the tracking of ball movement
        trackBallMovement = !trackBallMovement;
    });

    buttonFloat.addEventListener("click", function() {
        // Disable gravity for float effect
        gravityEnabled = false;
        balls.forEach(function(ball) {
            // Reset Y-axis velocity for floating effect
            ball.velocityY = getRandomVelocity();
        });
    });

    buttonGravity.addEventListener("click", function() {
        // Enable gravity for gravity effect
        gravityEnabled = true;
        balls.forEach(function(ball) {
            // Apply a constant gravity value
            ball.velocityY += 0.1;
        });
    });

    buttonGenMouse.addEventListener("click", function() {
        // Toggle ball creation on mouse click
        enableMouseCreation = !enableMouseCreation;
    });

    // Event listener for enabling/disabling random walk
    document.getElementById('buttonRandomWalk').addEventListener('click', function() {
        enableRandomWalk = !enableRandomWalk;
        // Consider adding a console log to confirm this is working
        console.log("Random walk enabled:", enableRandomWalk);
    });
    

    function accelerateAnimation() {
        balls.forEach(function(ball) {
            ball.velocityX *= 1.1;
            ball.velocityY *= 1.1;
        });
        disableRandomWalkTemporarily = true;
        disableRandomWalkCounter = disableRandomWalkDuration;
    }
    
    function decelerateAnimation() {
        balls.forEach(function(ball) {
            ball.velocityX *= 0.9;
            ball.velocityY *= 0.9;
        });
        disableRandomWalkTemporarily = true;
        disableRandomWalkCounter = disableRandomWalkDuration;
    }
    

    // Attach event listeners to acceleration and deceleration buttons
    buttonAccelerate.addEventListener("click", accelerateAnimation);
    buttonDecelerate.addEventListener("click", decelerateAnimation);

    // Event listener for handling window resizing
    window.addEventListener("resize", handleResize);
});
