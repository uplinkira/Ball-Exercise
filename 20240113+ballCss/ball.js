//Set global variable that would contain the position, velocity and the html element "ball"
var ball = document.getElementById("ball");
var velocity = 100;
var positionX = 0;
var positionY = 0;
var reverseX = false; 
var reverseY = false; 

//write a function that can change the position of the html element "ball"
function moveBall() {
  // Two fixed x-axis coordinates (you will use these variables in step 3)
  var Xmin = 0;
  var Xmax = 300;
  var Ymin = 0;
  var Ymax = 200; 

  positionX += velocity;

  if (reverseY === false)  {
    positionY += velocity;  
  } else {
    positionY -= velocity;
  }

  ball.style.left = positionX + "px";
  ball.style.top = positionY + "px";

  // Check if the ball has reached the edges
  if (positionX >= Xmax || positionX <= Xmin) {
    reverseX = !reverseX; 
  }
  if (positionY >= Ymax || positionY <= Ymin) {
    reverseY = !reverseY; 
  }

}

// This call the moveBall function every 100ms
setInterval(moveBall, 100);
