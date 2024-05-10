### PacMen ♥ Balls

This folder contains files for a PacMen ♥ Balls animation, designed to create an interactive and engaging experience with balls and PacMen moving within a container.

---

#### `index.html`

This HTML file serves as the entry point for the animation. It contains elements for controlling the animation, such as buttons for creating balls, toggling gravity, and generating PacMen on mouse clicks.

Key elements:

- **Canvas Element (`#trailCanvas`):** Used to display trails left behind by moving balls.
- **Control Panel (`#controlPanel`):** Contains buttons for creating balls, toggling gravity, generating PacMen, and additional effects.

#### `pacmen.js`

This JavaScript file provides the logic for creating and animating balls and PacMen within the container. It includes functions for creating balls, handling collisions, updating ball positions, and animating PacMen movements.

Key features:

- **Ball Creation:** Functions for creating balls with random sizes, colors, positions, and velocities.
- **PacMan Animation:** Logic for animating PacMen movements, including mouth opening and closing based on proximity to other balls.
- **Collision Detection:** Functions to detect collisions between balls and between balls and container walls.
- **Gravity and Random Walk Effects:** Options to toggle gravity effect and enable random walk movement for balls.

#### `ballJ.css`

This CSS file provides styling for the animation elements, including the container, balls, PacMen, and control panel.

Key styles:

- **Container (`#container`):** Styling to position and hide overflow of animation elements.
- **Balls (`.ball`):** Styling for regular balls, including position, size, and transition effects.
- **PacMen (`pacman`):** Styling for PacMen, including circular shape and background images.
- **Control Panel (`#controlPanel`):** Styling for the control panel, including position, background color, and button styles.

### Usage

1. Open `index.html` in a web browser.
2. Use the control panel buttons to interact with the animation:
    - Adjust the number of balls.
    - Toggle gravity effect.
    - Generate PacMen on mouse clicks.
    - Add additional effects using other buttons.

### Additional Notes

- The animation provides an interactive experience with customizable settings for creating balls and PacMen.
- Users can experiment with different settings and effects to observe various animation behaviors.
- The animation logic ensures smooth movement and realistic interactions between elements.

Enjoy exploring the PacMen ♥ Balls animation for a fun and dynamic experience!