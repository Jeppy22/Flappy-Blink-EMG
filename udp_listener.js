// udp_listener.js
// A simple diagnostic tool to check if any UDP data is arriving from the OpenBCI GUI.
// This script does NOT parse OSC data, it just listens for raw packets.

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 9000;
const HOST = '127.0.0.1';

server.on('error', (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close();
});

// This function runs every time a data packet is received.
server.on('message', (msg, rinfo) => {
  console.log(`Received a data packet! Size: ${msg.length} bytes.`);
  // We are not trying to parse it, just confirming we received something.
  // If you see this message repeatedly, the connection is working!
});

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
  console.log('Please start streaming data from the OpenBCI GUI now...');
  console.log('If the connection is working, you will see "Received a data packet!" messages below.');
});

server.bind(PORT, HOST);
