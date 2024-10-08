import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit'; 
import helmet from 'helmet'; 
import ExpressBrute from 'express-brute'; // Import Express Brute for brute-force protection
import { addUser, findUserByUsername, findUserByAccountNumber, findUserByIdentificationNumber } from '../db/conn.mjs';
import pkg from 'validator'; // Import the default export from validator
const { escape, trim } = pkg; // Destructure the functions you need

const router = express.Router();

// Configure Express Brute for brute-force protection
const store = new ExpressBrute.MemoryStore(); // Memory store for this example
const bruteForce = new ExpressBrute(store, {
    freeRetries: 100, // Allow 5 free retries
    minWait: 5000, // Start with 5 seconds wait after retries are used up
    maxWait: 60 * 1000, // Maximum wait time of 1 minute
    lifetime: 60 * 60 // Brute force data persists for 1 hour
});

// Set rate limiters for login and registration
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many login attempts, try again later.' });
const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many registration attempts, try again later.' });

// Set security headers using helmet
router.use(helmet());

// Input validation patterns
const namePattern = /^[a-zA-Z\s]{1,50}$/;
const usernamePattern = /^[a-zA-Z0-9]{4,30}$/;
const accountNumberPattern = /^[0-9]{7,11}$/;
const identificationNumberPattern = /^[0-9]{13}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Input validation function
const validateInput = (input, regex) => regex.test(input);

// Registration route with input validation and rate limiting
router.post('/register', bruteForce.prevent, registerLimiter, async (req, res) => {
  const { firstName, lastName, username, accountNumber, identificationNumber, accountType, password } = req.body;

  // Sanitize inputs
  const sanitizedFirstName = escape(trim(firstName));
  const sanitizedLastName = escape(trim(lastName));
  const sanitizedUsername = escape(trim(username));
  const sanitizedAccountNumber = escape(trim(accountNumber));
  const sanitizedIdentificationNumber = escape(trim(identificationNumber));

  // Validate inputs
  if (!validateInput(sanitizedFirstName, namePattern) || 
      !validateInput(sanitizedLastName, namePattern) ||
      !validateInput(sanitizedUsername, usernamePattern) ||
      !validateInput(sanitizedAccountNumber, accountNumberPattern) ||
      !validateInput(sanitizedIdentificationNumber, identificationNumberPattern) ||
      !validateInput(password, passwordPattern)) {
    return res.status(400).json({ message: 'Invalid input format' });
  }

  try {
    const existingUser = await findUserByUsername(sanitizedUsername) 
                          || await findUserByAccountNumber(sanitizedAccountNumber) 
                          || await findUserByIdentificationNumber(sanitizedIdentificationNumber);

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
      firstName: sanitizedFirstName, 
      lastName: sanitizedLastName, 
      username: sanitizedUsername, 
      accountNumber: sanitizedAccountNumber, 
      identificationNumber: sanitizedIdentificationNumber,
      accountType: accountType,
      password: hashedPassword 
    };
    const result = await addUser(newUser);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route with enhanced security
router.post('/login', bruteForce.prevent, loginLimiter, async (req, res) => {
  const { username, accountNumber, password } = req.body;

  // Sanitize inputs
  const sanitizedUsername = escape(trim(username));
  const sanitizedAccountNumber = escape(trim(accountNumber));

  try {
    const user = await findUserByUsername(sanitizedUsername);
    if (!user || user.accountNumber !== sanitizedAccountNumber) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Use a strong, securely stored secret for JWT
    const token = jwt.sign({ userId: user._id }, "this_is_not_a_real_secret", { expiresIn: '1h' }); // Use a strong secret
    res.status(200).json({ message: 'Login successful', token, userDetails: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
