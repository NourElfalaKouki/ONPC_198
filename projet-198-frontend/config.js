
// Manually set your dev machine’s LAN IP and backend port here:
const SERVER_IP   = '192.168.1.101';  // ← your IP (the ip of the server we are going to communicate with)
const SERVER_PORT = '4000';           // ← your backend port

// Build the full URL:
export const SERVER_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

// (Optional) You can also export IP and port separately:
export { SERVER_IP, SERVER_PORT };
