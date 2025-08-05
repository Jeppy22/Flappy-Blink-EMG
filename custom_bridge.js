// custom_bridge.js
// Final Version: This script listens for UDP packets from the OpenBCI GUI,
// parses the JSON string inside them, finds the PEAK signal in each packet,
// and broadcasts it over a WebSocket to the Flappy Bird game.

const dgram = require('dgram');
const { WebSocketServer } = require('ws');

// --- Configuration ---
const UDP_PORT = 9000;
const UDP_HOST = '127.0.0.1';
const WEBSOCKET_PORT = 8080;

// --- WebSocket Server Setup ---
const wss = new WebSocketServer({ port: WEBSOCKET_PORT });
console.log(`WebSocket server started on port ${WEBSOCKET_PORT}. Waiting for connections...`);

wss.on('connection', ws => {
  console.log('A game has connected to the WebSocket.');
  ws.on('close', () => {
    console.log('A game has disconnected.');
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // 1 means OPEN
      client.send(JSON.stringify(data));
    }
  });
}

// --- UDP Server Setup ---
const udpServer = dgram.createSocket('udp4');

udpServer.on('error', (err) => {
  console.log(`UDP Server error:\n${err.stack}`);
  udpServer.close();
});

// This is the final, working message handler.
udpServer.on('message', (msg, rinfo) => {
  try {
    // 1. Convert the raw data packet (buffer) into a readable text string.
    const jsonString = msg.toString('utf-8');
    
    // 2. Parse the text string as JSON to get a JavaScript object.
    const parsedData = JSON.parse(jsonString);

    // 3. Check if the parsed data has the structure we expect.
    if (parsedData && parsedData.data && Array.isArray(parsedData.data[0]) && parsedData.data[0].length > 0) {
      
      const channel1Samples = parsedData.data[0];

      // 4. Find the sample with the largest magnitude (max absolute value).
      // This is more robust for catching sharp spikes like blinks.
      let peakSample = channel1Samples[0];
      for (let i = 1; i < channel1Samples.length; i++) {
          if (Math.abs(channel1Samples[i]) > Math.abs(peakSample)) {
              peakSample = channel1Samples[i];
          }
      }

      // 5. Broadcast this peak value to the game in the expected format.
      const dataToSend = {
        address: '/eeg/1', // The game is listening for this address
        args: [peakSample] // Send the single highest value from the packet
      };
      broadcast(dataToSend);
    }
  } catch (e) {
    // This will catch any errors if the GUI sends a malformed JSON packet.
    // We can safely ignore these.
  }
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`UDP Server listening for OpenBCI data on ${address.address}:${address.port}`);
});

// Start the UDP server
udpServer.bind(UDP_PORT, UDP_HOST);

// --- Installation Check ---
try {
    require.resolve("ws");
} catch(e) {
    console.error("The 'ws' package is not installed. Please run 'npm install ws' in your terminal.");
    process.exit(e.code);
}
