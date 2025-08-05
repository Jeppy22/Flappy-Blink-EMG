Flappy Blink EMG

This project is a custom version of the classic Flappy Bird game that is controlled by a player's muscle signals (EMG). It uses a custom Node.js server to act as a bridge between an OpenBCI bio-sensing device and the HTML/JavaScript game, allowing blinks or muscle contractions to make the bird jump.

Features
Bio-signal Control: Control the game with an EMG signal (e.g., from a blink or muscle clench).

Calibration: The game automatically calibrates a blink threshold to adapt to different users.

Real-time Feedback: Displays the live signal value and the calculated threshold.

How to Run the Project
To run this project, you need to have a bio-sensing device (like an OpenBCI board) and the OpenBCI GUI configured to stream data.

Step 1: Install Dependencies
Open your terminal, navigate to the project directory, and install the necessary Node.js packages.

Bash
npm install ws

Step 2: Start the Bridge Server
This script listens for data from the OpenBCI GUI and sends it to the game.

Bash
node custom_bridge.js

Step 3: Stream Data from OpenBCI
Start your OpenBCI GUI.

Configure it to stream data via a UDP port to localhost:9000.

Begin streaming data.

Step 4: Play the Game
Open the flappy_blink.html file in your web browser.

With the server running and data streaming, click anywhere on the game canvas to begin.

Blink or flex your muscle to make the bird jump!
