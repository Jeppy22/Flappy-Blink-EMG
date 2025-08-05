// bridge.js
// This script listens for OSC data from the OpenBCI GUI and forwards it
// to a WebSocket connection that our Flappy Bird game can listen to.

const OSC = require('osc-js');

// Configuration for our WebSocket server and OSC listener
const config = {
  // Where the OSC (UDP) server will listen
  udpServer: {
    host: 'localhost',
    port: 9000,
    exclusive: false
  },
  // Where the WebSocket server will be hosted
  wsServer: {
    host: 'localhost',
    port: 8080
  }
};

// Create a new OSC instance with the BridgePlugin, which is the modern way to do this.
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

// This function is called when the bridge is ready
osc.on('open', () => {
  const { udpServer, wsServer } = osc.options.plugin.options;
  console.log('OSC to WebSocket Bridge is running!');
  console.log(`Listening for OSC data on UDP port: ${udpServer.port}`);
  console.log(`Broadcasting to WebSockets on port: ${wsServer.port}`);
});

// Add an error handler to catch any issues
osc.on('error', (err) => {
    console.error("An error occurred with the OSC bridge:", err);
});

// Start the bridge
osc.open();

console.log('Starting bridge...');
