import express from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors'; // Import the CORS package
import cookieParser from 'cookie-parser'; // Import cookie-parser
import ExpressBrute from 'express-brute'; // Import Express Brute for brute force protection
import rateLimit from 'express-rate-limit'; // Import express-rate-limit for rate limiting
import helmet from 'helmet'; // Import helmet for setting security headers
import UserController from './routes/UserController.mjs'; // Import your UserController routes
import PaymentController from './routes/PaymentController.mjs'; // Import your PaymentController routes

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

// Apply CORS middleware with the configuration
app.use(cors(corsOptions));

// Apply helmet for security headers
app.use(helmet());

// Middleware for parsing JSON requests
app.use(express.json());

// Add cookie-parser middleware
app.use(cookieParser());

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all requests
app.use(limiter);

// Configure Express Brute
const store = new ExpressBrute.MemoryStore(); // Store brute force data in memory
const bruteForce = new ExpressBrute(store, {
    freeRetries: 5, // Number of allowed attempts before blocking
    minWait: 5000, // Minimum wait time of 5 seconds after retries are exceeded
    maxWait: 60 * 1000, // Maximum wait time of 1 minute
    lifetime: 60 * 60 // Brute force data persists for 1 hour
});

// Use the UserController routes with brute force protection for login
app.use(urlPrefix + 'users', bruteForce.prevent, UserController);

// Use the PaymentController routes with brute force protection for sensitive actions
app.use(urlPrefix + 'payments', bruteForce.prevent, PaymentController);

// Health Check Endpoint
app.get(urlPrefix + 'health', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

// Create HTTPS server
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
