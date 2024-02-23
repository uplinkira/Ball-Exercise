// 元素尺寸检测：更改了如何检测球体是否碰到容器边缘的方式。我使用了 ball.offsetWidth 和 ball.offsetHeight 来获取球体的实际尺寸。Element Size Detection: Changed how to detect if a sphere hits the edge of a container. I used ball.offsetWidth and ball.offsetHeight to get the actual dimensions of the sphere.

// 清除旧球体：在创建新球体之前，我添加了代码来清除 container 中的所有子元素，这确保每次点击按钮时都从空的容器开始。Clear the old sphere: Before creating the new sphere, I added code to clear all child elements within container , this ensures that each time the button is clicked it starts with an empty container.

// 球体位置赋值：在 createBall 函数中，球体的初始 left 和 top 样式现在是根据它们的初始 x 和 y 属性设置的。Sphere position assignment: In the createBall function, the sphere's initial left and top styles are now based on their initial x and y attribute setting.

// 动画循环：updateBalls 函数中使用了 requestAnimationFrame 来创建平滑的动画效果。Animation loop: updateBalls requestAnimationFrame is used in the function to create a smooth animation effect.


document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");
    const ballCountInput = document.getElementById("ballCount");
    const buttonCreate = document.getElementById("buttonCreate");
    let balls = [];
    let animationId = null;

    function createBall() {
        const ball = document.createElement("div");
        ball.className = "ball";
        ball.style.backgroundColor = getRandomColor();

        //初始化球体的位置和速度
        //Initialize the position and speed of the sphere
        const size = Math.random() * 50 + 10; // Random size between 10px and 60px
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;

        ball.x = Math.random() * (container.clientWidth - size);
        ball.y = Math.random() * (container.clientHeight - size);
        ball.velocityX = Math.random() * 5 - 2.5;
        ball.velocityY = Math.random() * 5 - 2.5;

        ball.style.left = ball.x + 'px';
        ball.style.top = ball.y + 'px';
        // vs. `${ball.y}px`: ball.x and ball.y represent the logical position of the sphere and are not directly dependent on the CSS properties left and top
        // 与 `${ball.y}px` 相比：ball.x 和 ball.y 表示球体的逻辑位置，不直接依赖于 CSS 属性 left 和 top


        container.appendChild(ball);
        return ball;
    }

    function getRandomColor() {
        return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }

    function checkWall() {
        // 获取容器的当前的宽度和高度
        // Get the current width and height of the container
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        //更新球体的位置和方向
        //Update the position and direction of the balls
        balls.forEach(function (ball) {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            if (ball.x < 0 || ball.x + ball.offsetWidth > container.clientWidth) {
                ball.velocityX *= -1;
                ball.style.backgroundColor = getRandomColor();
            }

            if (ball.y < 0 || ball.y + ball.offsetHeight > container.clientHeight) {
                ball.velocityY *= -1;
                ball.style.backgroundColor = getRandomColor();
            }

            ball.style.left = ball.x + 'px';
            ball.style.top = ball.y + 'px';
        });

        animationId = requestAnimationFrame(updateBalls);
    }

    //在窗口大小调整时重新计算球体的位置
    //Recalculate the position of the sphere when the window size is resized
    function handleResize() {
        cancelAnimationFrame(animationId);
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // 根据新的容器尺寸更新每个球体的位置
        // Update the position of each sphere based on the new container size
        balls.forEach(function (ball) {
            // 确保球体位置在新容器范围内??
            // Make sure the sphere position is within the new container range
            ball.x = Math.min(ball.x, containerWidth - ball.offsetWidth);
            ball.y = Math.min(ball.y, containerHeight - ball.offsetHeight);
        });

        //重新开始动画循环
        updateBalls();
    }

    // ball.x = Math.min(ball.x, containerWidth - ball.offsetWidth);: This line calculates the new x-coordinate for the ball after the container has been resized. It uses Math.min(), which returns the smallest of the given numbers. Here, it's used to ensure that the ball's x-coordinate (ball.x) does not exceed the container's width minus the ball's own width (ball.offsetWidth). If the ball's current x-coordinate is within the new container's width, it will remain the same; otherwise, it will be set to the maximum allowed value that keeps the ball within ball.
    // 此行在容器大小调整后计算球的新 x 坐标。它使用 Math.min() ，它返回给定数字中最小的一个。在这里，它用于确保球的 x 坐标 ( ball.x ) 不超过容器的宽度减去球自身的宽度 ( ball.offsetWidth )。如果球的当前 x 坐标在新容器的宽度内，它将保持不变；否则，它将被设置为将球保持在范围内的最大允许值

    function createBalls(count) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        // Clear the container
        //.firstChild is a property that returns the first child node of the specified element, or null if there are no child nodes. .firstChild 是返回指定元素的第一个子节点的属性，如果没有子节点，则返回 null
        // In the context of the condition in the while loop (container.firstChild), it acts as a truthy check. If there is a first child (i.e., the container is not empty), it evaluates to true and the loop continues. If there are no children (the container is empty), it evaluates to false, and the loop stops.在 while 循环 ( container.firstChild ) 中的条件上下文中，它充当真实检查。如果存在第一个子级（即容器不为空），则其计算结果为 true 并且循环继续。如果没有子级（容器为空），则计算结果为 false，并且循环停止。

        balls = [];

        for (let i = 0; i < count; i++) {
            balls.push(createBall());
        }
    }

    //添加事件监听器来处理窗口尺寸变化
    //Add event listeners to handle window size changes
    window.addEventListener("resize", handleResize);

    buttonCreate.addEventListener("click", function () {
        const ballCount = parseInt(ballCountInput.value, 10);
        if (!isNaN(ballCount)) {
            cancelAnimationFrame(animationId);
            createBalls(ballCount);
            updateBalls();
        }
    });
});

// if (!isNaN(ballCount)) { ：此行使用 isNaN 函数检查 ballCount 是否不是 NaN（非数字）值。这是确保用户输入有效号码的一种方法。如果值不是数字， isNaN 将返回 true ，而 !isNaN(ballCount) 将返回 false ，导致条件块不执行。
// if (!isNaN(ballCount)) {: This line uses the isNaN function to check if ballCount is not a NaN (Not-a-Number) value. It's a way to ensure that the user has entered a valid number. If the value is not a number, isNaN would return true, and !isNaN(ballCount) would be false, causing the conditional block not to execute.
