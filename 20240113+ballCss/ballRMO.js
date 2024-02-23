//创建多个球元素并将它们添加到页面中。Create multiple ball elements and add them to the page.

// 每个球都有随机的颜色、大小、位置和速度。Each ball has a random color, size, position and speed.

// 更新球的位置和方向，检测碰到容器边界后反向运动。Update the ball's position and direction and detect reverse movement after hitting the container boundary.

// 使用 CSS 修改球的位置和颜色，利用 transform 属性以提高性能。Use CSS to modify the ball's position and color, leveraging the transform properties to improve performance.

// 使用 requestAnimationFrame 实现连续的动画效果。Use requestAnimationFrame to achieve continuous animation effects.

// Get the container element
const container = document.getElementById("container");

// Create an array to store all the balls
const balls = [];

// Create and add multiple balls
function createBall() {
  const fragment = document.createDocumentFragment();
  // the empty document fragment is a virtual DOM container and does not directly affect the actual DOM structure.

  //Create （i < ）n balls
  for (let i = 0; i < 10; i++) {
    const ball = document.createElement("div");
    //Create a div element and save it in the variable ball .

    ball.classList.add("ball");
    //给这个 div 元素添加一个名为 "ball" 的CSS类，以便之后可以通过CSS样式来设置球的外观。
    //Add a CSS class named "ball" to this div element so that you can later set the appearance of the ball through CSS styles.

    const size = Math.floor(Math.random() * 50) + 30;
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    const x = Math.random() * (container.clientWidth - size);
    const y = Math.random() * (container.clientHeight - size);
    const velocityX = (Math.random() - 0.5) * 10;
    const velocityY = (Math.random() - 0.5) * 10;

    ball.style.cssText = `width: ${size}px; height: ${size}px; background-color: ${color}; transform: translate(${x}px, ${y}px);`; 
    //got all style properties of an HTML element in one go

    // transform: translate(${x}px, ${y}px);: 这部分应用了一个CSS变换，translate(${x}px, ${y}px) 将元素在水平方向上移动 ${x}px，在垂直方向上移动 ${y}px。${x} 和 ${y} 是代表水平和垂直位移的变量。 transform: translate(${x}px, ${y}px); :
    // This part applies a CSS transform, translate(${x}px, ${y}px) moves the element ${x}px horizontally and ${y}px vertically . ${x} and ${y} are variables representing horizontal and vertical displacement.     


    // Store the ball's properties in an object
    const ballObject = {
      element: ball, 
      size, 
      color, 
      x, 
      y, 
      velocityX, 
      velocityY
    };
   
    // Add the ball object to the array of balls
    balls.push(ballObject);
    
    // 元素加入虚拟片段容器，但未加入实际DOM。the created div elements are added to the document fragment fragment , but they are not added to the actual DOM yet.
    fragment.appendChild(ball);

  }
  // 当循环结束后，文档片段 fragment 包含了所有创建的球元素，但它们还没有显示在页面上。When the loop ends, the document fragment fragment contains all the ball elements created, but they are not yet displayed on the page.

  container.appendChild(fragment);
  //更新一次DOM，加入所有球。all the balls in the document fragment are added to the actual DOM container container at once
}

// Update the positions of the balls
function updateBalls() {
  balls.forEach(ball => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // Boundary detection to reverse direction when a ball hits the container's edges
    //如果球的 x 坐标小于0（左边界）或大于容器宽度减去球的大小（右边界）
    //If the ball's x coordinate is less than 0 (left border) or greater than the container width minus the size of the ball (right border)
    if (ball.x < 0 || ball.x + ball.size > container.clientWidth) {
      ball.velocityX *= -1;
      ball.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }
    //球的 y 坐标小于0（上边界）或大于容器高度减去球的大小（下边界）
    //If the ball's y coordinate is less than 0 (upper border) or greater than the container height minus the size of the ball (lower border)
    if (ball.y < 0 || ball.y + ball.size > container.clientHeight) {
      ball.velocityY *= -1;
      ball.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    }

    // Update the ball's position and color by modifying its CSS properties
    ball.element.style.backgroundColor = ball.color;
    ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
    ////球的位置更新是通过修改transform属性实现的，这能够更有效地利用浏览器的渲染性能
    //the ball's position is updated by modifying the transform attribute, which can more effectively utilize the browser's rendering performance
  });

  requestAnimationFrame(updateBalls);
  //最后，使用 requestAnimationFrame(updateBalls) 来调度下一次更新，这将使函数递归调用，从而持续地更新球的位置和状态，实现动画效果。Finally, use requestAnimationFrame(updateBalls) to schedule the next update, which will cause the function to be called recursively to continuously update the position and state of the ball to achieve animation effects.
}

createBall();
requestAnimationFrame(updateBalls);
