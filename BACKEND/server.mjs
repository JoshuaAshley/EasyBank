import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors'; // Import the CORS package
import cookieParser from 'cookie-parser'; // Import cookie-parser
import UserController from './routes/UserController.mjs'; // Import your UserController routes

const PORT = 3001;
const app = express();
const urlPrefix = "/api/v1/";

// Define the correct path to your private key and certificate
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

// CORS Configuration
const corsOptions = {
    origin: '*', // Allow all origins (for production, consider restricting this to specific domains)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Enable CORS middleware with the configuration
app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(express.json());

// Add cookie-parser middleware
app.use(cookieParser());

// Use the UserController routes
app.use(urlPrefix + 'users', UserController); // Mount UserController to handle /api/users routes

// Health Check Endpoint
app.get(urlPrefix + 'health', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

// Pass the 'app' as a second argument to https.createServer
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});