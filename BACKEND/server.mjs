import express from 'express';
import https from 'https';
import fs from 'fs';

const PORT = 3001;
const app = express();

// Define the correct path to your private key and certificate
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
  };

// Middleware for parsing JSON requests
app.use(express.json());

// Pass the 'app' as a second argument to https.createServer
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
