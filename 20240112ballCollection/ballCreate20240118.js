// Wait for the DOM to be fully loaded before executing the script
//  This ensures that all elements referenced in the script are available before any code is executed.这可确保在执行任何代码之前，脚本中引用的所有元素都可用。
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
    
    // Variable Initialization: Here, an array balls is initialized to store the ball objects, and variables animationId and gravityEnabled are declared for managing animations and gravity effects, respectively.
    // 变量初始化：在这里，初始化一个数组 balls 来存储球对象和变量 animationId ，并 gravityEnabled 分别用于管理动画和重力效果。
    let balls = [];
    let animationId = null;
    let gravityEnabled = false;
    let enableMouseCreation = false;
    let trackBallMovement = false;
    let enableRandomWalk = false;
    let stepSize = 5;// Used for random walking


    // Function to create a new ball with random properties
    function createBall() {
        const size = getRandomSize(10, 60);
        const position = getRandomPosition(size);

        const ball = document.createElement("div");
        ball.className = "ball";
        ball.style.backgroundColor = getRandomColor();
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        ball.style.left = `${position.x}px`;
        ball.style.top = `${position.y}px`;

        ball.velocityX = getRandomVelocity();
        ball.velocityY = getRandomVelocity();

        container.appendChild(ball);
        return ball;
    }

    // Function to create a new ball with fixed position
    document.addEventListener("mousedown", function(e) {
        if (enableMouseCreation) {
            const newBall = createBall();
            newBall.x = e.clientX;
            newBall.y = e.clientY;
            balls.push(newBall);
        }
    });

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
        return Math.random() * 5 - 2.5;//-2.5~2.5
    }

    function getRandomColor() {
        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }

    // Update function to animate the balls
    function updateBalls() {
        balls.forEach(function(ball) {
            if (enableRandomWalk) {
                ball.velocityX += getRandomVelocity() / 10;
                ball.velocityY += getRandomVelocity() / 10;
            }

            if (gravityEnabled) {
                ball.velocityY += 0.1; //causing the balls to gradually accelerate downward in the vertical direction.
                //使球在垂直方向上逐渐向下加速。
            }
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            ball.style.left = `${ball.x}px`;
            ball.style.top = `${ball.y}px`;
            checkWall(ball);
        });
    
        animationId = requestAnimationFrame(updateBalls);
    }
    // animationId = requestAnimationFrame(updateBalls);: Finally, this line uses the requestAnimationFrame function to request the browser to execute the next frame of animation. This allows for continuous updates of the ball's position and state, creating a smooth animation effect as it updates at the display's refresh rate. animationId = requestAnimationFrame(updateBalls); ：最后，此行使用该 requestAnimationFrame 函数请求浏览器执行下一帧动画。这允许连续更新球的位置和状态，在以显示器的刷新率更新时创建流畅的动画效果。
    

    // Check for collisions with the container walls
    function checkWall(ball) {
        if (ball.x < 0 || ball.x + ball.offsetWidth > container.clientWidth) {
            ball.velocityX *= -1;
            ball.style.backgroundColor = getRandomColor();
        }
        if (ball.y < 0 || ball.y + ball.offsetHeight > container.clientHeight) {
            ball.velocityY *= -1;
            ball.style.backgroundColor = getRandomColor();
        }
    }

    // Handle window resizing
    function handleResize() {
        balls.forEach(function(ball) {
            ball.x = Math.min(ball.x, container.clientWidth - ball.offsetWidth);
            ball.y = Math.min(ball.y, container.clientHeight - ball.offsetHeight);
        });
        cancelAnimationFrame(animationId);
        updateBalls();
    }

    // Function to create the specified number of balls
    function createBalls(count) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        balls = [];
        for (let i = 0; i < count; i++) {
            const newBall = createBall();
            newBall.x = parseFloat(newBall.style.left);
            newBall.y = parseFloat(newBall.style.top);
            balls.push(newBall);
        }
    }
    //The count in createBalls(count) is a parameter that acts as a placeholder. It doesn't have a value of its own until the createBalls function is called with an argument. When you call createBalls(ballCount), you are essentially establishing a relationship where the count parameter in createBalls takes on the value of ballCount.count in createBalls(count) 是充当占位符的参数。在使用参数调用函数 createBalls 之前，它没有自己的值。调用 createBalls(ballCount) 时，实质上是在建立一种关系， count 其中 createBalls 的参数取值为 ballCount 。
    //The actual value for count is given to the function from outside when the function is called.调用函数时，将从外部为函数提供实际 count 值。
    //This expected number is referred to as count inside the function.此预期数字被引用为count在函数内部。
    //This integer value is then used as the argument for count when createBalls is called.然后，该整数值用作调用 createBalls 时的 count 参数。
    
    //createBalls(ballCount); // Here, 'ballCount' is passed as the 'count' parameter to the createBalls function.在这里，'ballCount' 作为 'count' 参数传递给 createBalls 函数。

    // Event listeners for buttons and window resize
    buttonCreate.addEventListener("click", function() {
        const ballCount = parseInt(ballCountInput.value, 10);
        //Check if the Input is a Number 检查输入是否为数字
        if (!isNaN(ballCount)) {
            cancelAnimationFrame(animationId);
            createBalls(ballCount);//calls the createBalls function, passing in the user input ballCount to count
            updateBalls();
        }
    });

    buttonFloat.addEventListener("click", function() {
        gravityEnabled = false; // Disable gravity for float effect
        balls.forEach(function(ball) {
            ball.velocityY = getRandomVelocity(); // Reset Y-axis velocity for floating effect
        });
    }); // Added missing closing bracket
    
    buttonGravity.addEventListener("click", function() {
        gravityEnabled = true; // Enable gravity for gravity effect
        balls.forEach(function(ball) {
            ball.velocityY += 0.1; // Apply a constant gravity value
        });
    });

    buttonAccelerate.addEventListener("click", accelerateAnimation);
    buttonDecelerate.addEventListener("click", decelerateAnimation);

    buttonGenMouse.addEventListener("click", function() {
        enableMouseCreation = !enableMouseCreation;
    });
    
    buttonTrack.addEventListener("click", function() {
        trackBallMovement = !trackBallMovement;
    });
    
    buttonRandom.addEventListener("click", function() {
        enableRandomWalk = !enableRandomWalk;
        if (enableRandomWalk) {
            updateBalls();
        }
    });

    function accelerateAnimation() {
        console.log("animation+");
        animationId = requestAnimationFrame(updateBalls);
    }
    
    function decelerateAnimation() {
        console.log("animation-");
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    window.addEventListener("resize", handleResize);
});

// Key points of this script:
// - Modular functions: The logic for creating balls is broken down into smaller functions for better readability and maintainability.
// - Random Number Generators: Specialized functions generate random sizes, positions, velocities, and colors, simplifying the main function's logic.
// - Collision Detection: The checkWall function now exists as a separate function to handle collisions between balls and the container's boundaries.
// - Window Resizing: The handleResize function ensures the correct position of balls when the window size is adjusted and restarts the animation loop.
// - Clearing and Creating Balls: The createBalls function first clears all existing balls in the container, then creates new balls based on the specified number.
// - Event Listeners: Added for creating balls, applying float effect (no gravity), and applying gravity effect.


// 此脚本的要点：
// - 模块化功能：创建球的逻辑被分解为更小的函数，以提高可读性和可维护性。
// - 随机数生成器：专用函数生成随机大小、位置、速度和颜色，从而简化主函数的逻辑。
// - 碰撞检测：该 checkWall 函数现在作为一个单独的函数存在，用于处理球与容器边界之间的碰撞。
// - 窗口大小调整：该 handleResize 功能可确保在调整窗口大小时球的正确位置并重新启动动画循环。
// - 清除和创建球：该 createBalls 函数首先清除容器中所有现有的球，然后根据指定的数字创建新球。
// - 事件侦听器：添加了用于创建球、应用浮动效果（无重力）和应用重力效果。