// Get the container element
const container = document.getElementById("container");

// Create an array to store all the balls
const balls = [];

// Create and add multiple balls
function createBall() {
  // Create a new <div> element for the ball
  const ball = document.createElement("div");
  // Assign the "ball" CSS class to the element
  ball.classList.add("ball");
  //ball.className = "ball"; 

  container.appendChild(ball); // Add the ball element to the container

  // Randomly generate properties for the ball
  const size = Math.floor(Math.random() * 50) + 30; // Generate a random size between 30 and 80 pixels
  //cn:Math.random() 生成一个0到1之间的随机数
  const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`; // Generate a random RGB color
  const x = Math.random() * (container.clientWidth - size); // Generate a random initial X-coordinate within the container
  //Math.random() * (container.clientWidth - size): This expression calculates a random horizontal (X-axis) position for the ball within the container. It does so by multiplying a random number between 0 and 1 with the available width of the container minus the size of the ball. This ensures that the ball's left edge is positioned at a random point within the container's width while leaving enough space for the entire ball to be visible within the container. Math.random() * (container.clientWidth - size) ：此表达式计算容器内球的随机水平（X 轴）位置。它通过将 0 到 1 之间的随机数乘以容器的可用宽度减去球的大小来实现。这确保了球的左边缘定位在容器宽度内的随机点，同时为整个球在容器内可见留下足够的空间。
  const y = Math.random() * (container.clientHeight - size); // Generate a random initial Y-coordinate within the container
  const velocityX = (Math.random() - 0.5) * 10; // Generate a random X-axis velocity between -5 and 5
  const velocityY = (Math.random() - 0.5) * 10; // Generate a random Y-axis velocity between -5 and 5

  // Set the ball's CSS properties based on the generated values
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;
  ball.style.backgroundColor = color;
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  // ball is a reference to a newly created div element that represents a ball. ball 是一个引用，指向一个表示球的新创建的 div 元素。
  // directly accessing the style property of the div element (represented by ball). 直接访问 div 元素（由 ball 表示）的 style 属性。

  
  // Store the ball's properties in an object
  const ballObject = {
    element: ball, // Reference to the ball's HTML element
    size, // Size of the ball
    color, // Color of the ball
    x, // X-coordinate of the ball
    y, // Y-coordinate of the ball
    velocityX, // X-axis velocity of the ball
    velocityY, // Y-axis velocity of the ball
  };

  balls.push(ballObject); // Add the ball object to the array of balls
  //array.push(element1, ..., elementN) adds one or more elements to the end of an array and returns the new length of the array.
}

// Update the positions of the balls(array)
function updateBalls() {
    for (const ball of balls) {
      // Update the ball's X and Y coordinates based on its velocity
      ball.x += ball.velocityX;//ball.x = ball.x + ball.velocityX
      ball.y += ball.velocityY;
  
      // Boundary detection to reverse direction when a ball hits the container's edges
      if (ball.x < 0 || ball.x + ball.size > container.clientWidth) {
        ball.velocityX *= -1;
        ball.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`; // Change the ball's color
      }
      //ball.x + ball.size > container.clientWidth is a boundary detection condition used to check if the ball has collided with the right edge of the container. ball.x + ball.size > container.clientWidth 是边界检测条件，用于检查球是否与容器的右边缘发生碰撞。
      //ball.x represents the current X-coordinate of the ball, which is the position of the left edge of the ball. ball.x 表示小球当前的X坐标，即小球左边缘的位置。
      // ball.size denotes the size of the ball, typically the side length of a square, which is often used to represent its width and height. ball.size 表示球的大小，通常是正方形的边长，常用来表示其宽度和高度。
      //container.clientWidth indicates the visible width of the container, which is the width of the container within the viewport. container.clientWidth 表示容器的可见宽度，即容器在视口内的宽度。

      if (ball.y < 0 || ball.y + ball.size > container.clientHeight) {
        ball.velocityY *= -1;
        ball.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`; // Change the ball's color
      }
  
      // Update the ball's position and color on the screen
      ball.element.style.left = `${ball.x}px`;
      ball.element.style.top = `${ball.y}px`;
      ball.element.style.backgroundColor = ball.color; // Set the ball's background color
    }
    // ball.element is a property of the ball object that represents the DOM element associated with that ball. ball.element 是 ball 对象的属性，表示与该球关联的 DOM 元素。
    
    // Request the next animation frame to continue the animation loop
    requestAnimationFrame(updateBalls);
  }

// adjust number of balls
for (let i = 0; i < 10; i++) {
  createBall();
}

// Start the animation loop
requestAnimationFrame(updateBalls);
