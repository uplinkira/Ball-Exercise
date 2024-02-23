// Set global variable that would contain the position, velocity, and the html element "ball"
var ball = document.getElementById("ballA");
var velocityX = 100;
var velocityY = 100;
var positionX = window.innerWidth / 2;
var positionY = window.innerHeight / 2;
// 设置球的初始位置在中心
//en: Set the initial position of the ball in the center
var reverseX = false;
var reverseY = false;

// write a function that can change the position of the html element "ball"
function moveBall() {
    // Two fixed x-axis and y-axis coordinates
    var Xmin = 0;
    var Xmax = window.innerWidth - ball.clientWidth;
    var Ymin = 0;
    var Ymax = window.innerHeight - ball.clientHeight;

    if (!reverseX) {
        positionX += velocityX;//en: The ball moves to the right
    } else {
        positionX -= velocityX;
    }

    if (!reverseY) {
        positionY += velocityY;//en: The ball moves to the bottom
    } else {
        positionY -= velocityY;
    }

    ball.style.left = positionX + "px";
    ball.style.top = positionY + "px";

    // Check if the ball has reached the edges on the x-axis
    if (positionX >= Xmax || positionX <= Xmin) {
        reverseX = !reverseX;
        ball.style.backgroundColor = getRandomColor();
    }

    // Check if the ball has reached the edges on the y-axis
    if (positionY >= Ymax || positionY <= Ymin) {
        reverseY = !reverseY;
        ball.style.backgroundColor = getRandomColor();
    }
}

// This function generates a random hexadecimal color code.
//cn: 这个函数生成一个随机的十六进制颜色代码。
function getRandomColor() {
    // Define a string containing all possible hexadecimal digits.
    //cn: 定义一个包含所有可能的十六进制数字的字符串。
    var letters = "0123456789ABCDEF";
    // The function begins by defining a string called letters containing all possible hexadecimal digits: "0123456789ABCDEF." In hexadecimal, these digits represent values from 0 to 15.该函数首先定义一个名为 letters 的字符串，其中包含所有可能的十六进制数字：“0123456789ABCDEF”。在十六进制中，这些数字代表 0 到 15 之间的值。


    // Initialize a variable to store the generated color and set it to a "#" symbol.
    //cn: 初始化一个变量来存储生成的颜色，并将其设置为“＃”符号。
    var color = "#";

    // Use a loop to generate six random hexadecimal digits for the color code.
    //cn: 使用循环为颜色代码生成六个随机的十六进制数字。
    for (var i = 0; i < 6; i++) {
        // Math.random() is used to generate a random floating-point number between 0 (inclusive) and 1 (exclusive). Math.random() 用于生成 0（含）和 1（不含）之间的随机浮点数。
        // Math.floor() rounds down that number to the nearest integer.
        //cn: Math.floor（）将该数字四舍五入到最近的整数。
        // We multiply this random number by 16 to get an index into the "letters" string.
        //cn: 我们将此随机数乘以16以获得“字母”字符串中的索引。
        var randomIndex = Math.floor(Math.random() * 16);
        // The generated random number is then multiplied by 16. Multiplying by 16 effectively scales the random number to a range from 0 to 15 (16 possibilities). This is because there are 16 hexadecimal digits (0 to 9 and A to F).将生成的随机数乘以 16。乘以 16 可以有效地将随机数缩放到 0 到 15 的范围（16 种可能性）。这是因为有 16 个十六进制数字（0 到 9 和 A 到 F）。

        // We concatenate the character from the "letters" string at the calculated index
        //cn: 我们将“字母”字符串中的字符与计算得到的索引连接起来
        // to the "color" string, building the hexadecimal color code.
        //cn: 到“颜色”字符串，构建十六进制颜色代码。
        color += letters[randomIndex];
        // The loop repeats this process six times to generate a six-digit hexadecimal color code.
        //cn: 循环重复此过程六次以生成六位十六进制颜色代码。
        //为什么需要6位？因为一个颜色代码由6位十六进制数字组成，每两位代表红、绿、蓝三原色的亮度，取值范围是00到FF。例如，红色的代码是#FF0000，绿色的代码是#00FF00，蓝色的代码是#0000FF，白色的代码是#FFFFFF，黑色的代码是#000000。
    }

    // Finally, the function returns the randomly generated color code.
    return color;
}






// This calls the moveBall function every 100ms
setInterval(moveBall, 100);
