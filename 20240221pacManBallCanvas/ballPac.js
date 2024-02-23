// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function() {
    // Part 1: Initial Setup and Utility Functions

    // 预加载所有 PacMan 图片
    let pacManImages = {
        openRight: new Image(),
        closedRight: new Image(),
        openLeft: new Image(),
        closedLeft: new Image()
    };

    pacManImages.openRight.src = 'PacMan1.png'; // 假设嘴巴张开向右
    pacManImages.closedRight.src = 'PacMan2.png'; // 假设嘴巴闭合向右
    pacManImages.openLeft.src = 'PacMan3.png'; // 假设嘴巴张开向左
    pacManImages.closedLeft.src = 'PacMan4.png'; // 假设嘴巴闭合向左

    // Get a reference to the canvas element and its context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to fill its parent container or a default value
    canvas.width = window.innerWidth || 800;
    canvas.height = window.innerHeight || 600;

    // Get references to control panel elements
    const ballCountInput = document.getElementById('ballCount');
    const buttonCreate = document.getElementById('buttonCreate');
    const buttonFloat = document.getElementById('buttonFloat');
    const buttonGravity = document.getElementById('buttonGravity');
    const buttonGenMouse = document.getElementById('buttonGenMouse');
    const buttonTrack = document.getElementById('buttonTrack');
    const buttonRandom = document.getElementById('buttonRandom');

    // Flags and variables for game state
    let balls = [];
    let gravityEnabled = false;
    let enableRandomWalk = false;




    // Utility functions for random values
    function getRandomSize(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomPosition(size, dimension) {
        return Math.random() * (dimension - size);
    }

    function getRandomVelocity() {
        return Math.random() * 5 - 2.5; // Range: -2.5 to 2.5
    }

    function getRandomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    // Part 2: Core Game Functions


    // Function to create and return a new ball or PacMan object
    function createBall(xPos = null, yPos = null, isPacMan = false) {
        const size = getRandomSize(10, 60);
        let position = {
            x: xPos !== null ? xPos : getRandomPosition(size, canvas.width),
            y: yPos !== null ? yPos : getRandomPosition(size, canvas.height)
        };

        return {
            x: position.x,
            y: position.y,
            size: size,
            color: getRandomColor(),
            velocityX: getRandomVelocity(),
            velocityY: getRandomVelocity(),
            isPacMan: isPacMan,
            mouthOpen: true // Only used if isPacMan is true
        };
    }

    // Function to draw a ball or PacMan on the canvas
    function drawObject(obj) {
        if (obj.isPacMan) {
            // 选择合适的 PacMan 图片
            let pacManImage;
            if (obj.velocityX >= 0) { // 向右移动
                pacManImage = obj.mouthOpen ? pacManImages.openRight : pacManImages.closedRight;
            } else { // 向左移动
                pacManImage = obj.mouthOpen ? pacManImages.openLeft : pacManImages.closedLeft;
            }

            // 绘制选中的 PacMan 图片
            ctx.drawImage(pacManImage, obj.x, obj.y, obj.size, obj.size);

            // 切换嘴巴状态以实现张合动画
            obj.mouthOpen = !obj.mouthOpen;
        } else {
            // 绘制普通球
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(obj.x + obj.size / 2, obj.y + obj.size / 2, obj.size / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }


    
    // Function to update and draw all balls on the canvas
    function updateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        balls.forEach(ball => {
            // Update position based on velocity
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            // Gravity effect
            if (gravityEnabled && !ball.isPacMan) {
                ball.velocityY += 0.1; // Simple gravity simulation
            }

            // Random walk effect
            if (enableRandomWalk && !ball.isPacMan) {
                ball.velocityX += Math.random() * 0.5 - 0.25;
                ball.velocityY += Math.random() * 0.5 - 0.25;
            }

            // Wall collision detection and response
            if (ball.x < 0 || ball.x + ball.size > canvas.width) {
                ball.velocityX *= -1;
            }
            if (ball.y < 0 || ball.y + ball.size > canvas.height) {
                ball.velocityY *= -1;
            }

            drawObject(ball); // Draw the ball on the canvas
        });

        requestAnimationFrame(updateCanvas); // Continue the animation loop
    }

    // Start the animation loop
    updateCanvas();
    
    // Part 3: Event Handlers and Control Logic
    // Event listener for the 'Create' button
    buttonCreate.addEventListener('click', function() {
        const count = parseInt(ballCountInput.value, 10);
        if (!isNaN(count) && count > 0) {
            for (let i = 0; i < count; i++) {
                balls.push(createBall());
            }
        } else {
            alert('Please enter a valid number of balls.');
        }
    });

    // Additional event listeners for other buttons to toggle gravity, enable random walk, etc.
    buttonFloat.addEventListener('click', () => gravityEnabled = false);
    buttonGravity.addEventListener('click', () => gravityEnabled = true);
    buttonRandom.addEventListener('click', () => enableRandomWalk = !enableRandomWalk);

    // Event listener for mouse clicks to create PacMan
    buttonGenMouse.addEventListener('click', function() {
        canvas.addEventListener('mousedown', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            balls.push(createBall(x, y, true)); // true indicates this is a PacMan
        }, { once: true }); // Remove listener after one use
    });

    // Resize event to adjust canvas size
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
    