// version:2024-02-23 
// 修复：pacMan嘴巴闭合动画频率过快，设置成嘴巴平时闭着，但是感应快要接触球的时候会打开，保持打开到让球消失后500ms会回到保持闭嘴的状态

// Wait for the DOM to be fully loaded before executing the script
// This ensures that all elements referenced in the script are available before any code is executed.
document.addEventListener("DOMContentLoaded", function() {
    // Get references to DOM elements
    const container = document.getElementById("container");
    const ballCountInput = document.getElementById("ballCount");
    const buttonCreate = document.getElementById("buttonCreate");
    const buttonFloat = document.getElementById("buttonFloat");
    const buttonGravity = document.getElementById("buttonGravity");
    const buttonGenMouse = document.getElementById("buttonGenMouse");
    const buttonTrack = document.getElementById("buttonTrack");
    const buttonRandom = document.getElementById("buttonRandom");
    
    // This flag will now control if we should attach or detach the mousedown event listener
    let pacManCreationEnabled = false;

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
    let trackBallMovement = false;
    let enableRandomWalk = false;

    // Preload all PacMan images to ensure they're available when needed
    let pacManImages = {
        openRight: new Image(),
        closedRight: new Image(),
        openLeft: new Image(),
        closedLeft: new Image()
    };

    pacManImages.openRight.src = 'images/PacMan1.png'; // Mouth open, facing right
    pacManImages.closedRight.src = 'images/PacMan2.png'; // Mouth closed, facing right
    pacManImages.openLeft.src = 'images/PacMan3.png'; // Mouth open, facing left
    pacManImages.closedLeft.src = 'images/PacMan4.png'; // Mouth closed, facing left
    
    function createBall(xPos = null, yPos = null, isPacMan = false) {
        // Define the size of the ball or PacMan randomly within a specified range
        const size = getRandomSize(10, 60);
    
        // Determine the position of the ball or PacMan. If specific coordinates are provided, use them; otherwise, generate a random position.
        let position = xPos !== null && yPos !== null ? { x: xPos, y: yPos } : getRandomPosition(size);
    
        // Create a new div element to represent the ball or PacMan
        const ball = document.createElement("div");
    
        if (!isPacMan) {
            // If it's a regular ball, set its class, background color, and other styles
            ball.className = "ball";
            ball.style.backgroundColor = getRandomColor();
        } else {
            // If it's a PacMan, set its class, initial background image, and custom properties
            ball.className = "pacman";
            // Initially set PacMan to face right with an open mouth using the preloaded image
            ball.style.backgroundImage = `url('${pacManImages.openRight.src}')`;
            ball.isPacMan = true; // Custom property to indicate it's a PacMan
            ball.direction = 0; // Initial direction: 0 for right
            ball.mouthOpen = true; // Custom property to track whether PacMan's mouth is open
        }
    
        // Set the size, initial position, and other common styles for both balls and PacMans
        ball.style.width = size + 'px';
        ball.style.height = size + 'px';
        ball.style.left = position.x + 'px';
        ball.style.top = position.y + 'px';
        ball.style.position = 'absolute'; // Ensure the ball or PacMan can be positioned absolutely within the container
    
        // Assign random velocities to the ball or PacMan for movement
        ball.velocityX = getRandomVelocity();
        ball.velocityY = getRandomVelocity();
    
        // Store the initial velocities for potential future use (e.g., resetting velocities)
        ball.initialVelocityX = ball.velocityX;
        ball.initialVelocityY = ball.velocityY;
    
        // Add the ball or PacMan to the container element in the DOM
        container.appendChild(ball);
    
        // Return the created ball or PacMan element for further manipulation if needed
        return ball;
    }
    

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

    function updateBalls() {
        // Loop through all balls (including PacMans) to update their positions and animations
        balls.forEach((ball, index) => {
            // Apply gravity if enabled (does not affect PacMan)
            if (gravityEnabled && !ball.isPacMan) {
                ball.velocityY += 0.1; // Simulate gravity by increasing Y velocity
            }
    
            // Apply random walk effect if enabled (does not affect PacMan)
            if (enableRandomWalk && !ball.isPacMan) {
                ball.velocityX += getRandomVelocityChange(); // Randomly change X velocity
                ball.velocityY += getRandomVelocityChange(); // Randomly change Y velocity
            }
    
            // Update the ball's position based on its velocity
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
    
            // Update the ball's CSS position to move it on the screen
            ball.style.left = ball.x + 'px';
            ball.style.top = ball.y + 'px';
    
            // Check for collisions with the container's walls
            checkWallCollisions(ball);
    
            // If the ball is a PacMan, handle its specific animations and interactions
            if (ball.isPacMan) {
                animatePacMan(ball); // Animate the PacMan's mouth movement
                checkPacManCollisions(ball, index); // Check for collisions with other balls
            }
    
            // If tracking is enabled, create a trail element for the ball
            if (trackBallMovement) {
                createTrailElement(ball);
            }
        });
    
        // Continue the animation loop by requesting the next animation frame
        animationId = requestAnimationFrame(updateBalls);
    }
        

    function clearTrackingPaths() {
        ballPaths.forEach(path => path.length = 0); // Clear each path
        // Optional: Clear visual representation of paths if applicable
    }


    // Animates PacMan by updating its background image based on direction and mouth state
    function animatePacMan(pacMan) {
        // Set PacMan's image to closed mouth by default
        const direction = pacMan.velocityX >= 0 ? 'Right' : 'Left';
        let imageName = `closed${direction}`;

        // If PacMan's mouth is supposed to be open, adjust the image name
        if (pacMan.mouthOpen) {
            imageName = `open${direction}`;
        }

        // Update PacMan's background image
        pacMan.style.backgroundImage = `url('${pacManImages[imageName].src}')`;
    }

    // Checks and handles collisions between PacMan and other balls
    function checkPacManCollisions(pacMan, pacManIndex) {
        balls.forEach((ball, index) => {
            if (!ball.isPacMan && index !== pacManIndex) {
                const dx = pacMan.x + pacMan.offsetWidth / 2 - (ball.x + ball.offsetWidth / 2);
                const dy = pacMan.y + pacMan.offsetHeight / 2 - (ball.y + ball.offsetHeight / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Detect proximity without actual collision
                if (distance < pacMan.offsetWidth && !pacMan.mouthTimeout) {
                    pacMan.mouthOpen = true; // Open the mouth
                    animatePacMan(pacMan); // Update animation immediately
                }

                // Collision detection
                if (distance < pacMan.offsetWidth / 2 + ball.offsetWidth / 2) {
                    // Remove the ball
                    container.removeChild(ball);
                    balls.splice(index, 1);

                    // Keep the mouth open
                    if (!pacMan.mouthTimeout) {
                        pacMan.mouthTimeout = setTimeout(() => {
                            pacMan.mouthOpen = false; // Close the mouth after 500ms
                            animatePacMan(pacMan); // Update animation immediately
                            clearTimeout(pacMan.mouthTimeout); // Clear the timeout
                            pacMan.mouthTimeout = null; // Reset the timeout variable
                        }, 500);
                    }
                }
            }
        });
    }
    
    // Checks and handles collisions with the container's walls
    function checkWallCollisions(ball) {
        if (ball.x < 0 || ball.x + ball.offsetWidth > container.clientWidth) {
            ball.velocityX *= -1; // Reverse X velocity on collision with left/right walls
            if (!ball.isPacMan) ball.style.backgroundColor = getRandomColor(); // Change color for non-PacMans
        }
        if (ball.y < 0 || ball.y + ball.offsetHeight > container.clientHeight) {
            ball.velocityY *= -1; // Reverse Y velocity on collision with top/bottom walls
            if (!ball.isPacMan) ball.style.backgroundColor = getRandomColor(); // Change color for non-PacMans
        }
    }

    
    function isOnScreen(ball) {
        // Check if the ball is within the visible area of the container
        const pastLeftEdge = ball.x + ball.offsetWidth < 0;
        const pastRightEdge = ball.x > container.clientWidth;
        const pastTopEdge = ball.y + ball.offsetHeight < 0;
        const pastBottomEdge = ball.y > container.clientHeight;
    
        // Return false if the ball has moved off-screen
        return !(pastLeftEdge || pastRightEdge || pastTopEdge || pastBottomEdge);
    }
    
    
    // Handle window resizing
    function handleResize() {
        // Adjust ball positions to stay within the new container dimensions
        balls.forEach(function(ball) {
            ball.x = Math.min(ball.x, container.clientWidth - ball.offsetWidth);
            ball.y = Math.min(ball.y, container.clientHeight - ball.offsetHeight);
        });
    
        // No need to call updateBalls() here if it's already running via requestAnimationFrame
        // But if the animation loop might be paused, you can restart it as follows:
        if (!animationId) {
            updateBalls(); // Restart the animation loop if it was paused
        }
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
    

    // The handler for creating PacMan on mouse click
    function createPacManOnClick(e) {
        // Prevent default behavior to avoid any conflicts such as text selection
        e.preventDefault();

        // Calculate the correct x and y taking the container's position into account
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - window.scrollX;
        const y = e.clientY - rect.top - window.scrollY;

        // Create PacMan with the corrected position
        const newPacMan = createBall(x, y, true);

        // Correctly set PacMan's position
        newPacMan.x = x - newPacMan.offsetWidth / 2;
        newPacMan.y = y - newPacMan.offsetHeight / 2;
        newPacMan.style.left = newPacMan.x + 'px';
        newPacMan.style.top = newPacMan.y + 'px';

        // Add PacMan to the array
        balls.push(newPacMan);

        // Start or continue the animation
        if (!animationId) {
            updateBalls();
        }
    }

    function clearPacMans() {
        // Iterate over the balls array backwards since we'll be removing elements
        for (let i = balls.length - 1; i >= 0; i--) {
            if (balls[i].isPacMan) {
                // Remove the PacMan element from the container
                container.removeChild(balls[i]);
                // Remove the PacMan from the balls array
                balls.splice(i, 1);
            }
        }
    }

    // Event listener for the PacMan creation toggle/clear button
    buttonGenMouse.addEventListener("click", function() {
        if (!pacManCreationEnabled) {
            // Enable PacMan creation mode
            pacManCreationEnabled = true;
            // Attach the mousedown event listener to create PacMan on click
            document.addEventListener("mousedown", createPacManOnClick);
        } else {
            // Disable PacMan creation mode
            pacManCreationEnabled = false;
            // Remove the mousedown event listener to stop creating PacMan on click
            document.removeEventListener("mousedown", createPacManOnClick);
            // Clear all PacMans from the DOM and the balls array
            clearPacMans();
        }
    });


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

    // Event listener for the track movement button
    buttonTrack.addEventListener("click", function() {
        // Toggle the tracking of ball movement
        trackBallMovement = !trackBallMovement;
        console.log("Tracking toggled:", trackBallMovement); // For debugging

        // Optional: Clear existing paths if tracking is disabled
        if (!trackBallMovement) {
            clearTrackingPaths();
        }
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

    buttonRandom.addEventListener("click", function() {
        // Toggle the random walk effect
        enableRandomWalk = !enableRandomWalk;
    
        // Reset ball velocities to initial values if random walk is disabled
        if (!enableRandomWalk) {
            balls.forEach(function(ball) {
                // Reset velocities to the initial values
                ball.velocityX = ball.initialVelocityX;
                ball.velocityY = ball.initialVelocityY;
            });
        }
    });
    
    // Event listener for handling window resizing
    window.addEventListener("resize", handleResize);
    
    // Start the animation loop
    updateBalls();
    // you should place the call updateBalls() at the end of your setup or initialization code within the document.addEventListener("DOMContentLoaded", function() { ... }); block. This ensures that all your setup, including the creation of balls or PacMans and the setup of event listeners, is completed before the animation starts. 应将updateBalls()调用放在 document.addEventListener("DOMContentLoaded", function() { ... }); 块内的设置或初始化代码的末尾。这可确保在动画开始之前完成所有设置，包括创建球或吃豆人以及事件侦听器的设置。
    // preventing potential issues like trying to animate elements that haven't been fully initialized yet.防止出现潜在问题，例如尝试为尚未完全初始化的元素制作动画
});
