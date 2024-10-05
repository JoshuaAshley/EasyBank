import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit'; 
import helmet from 'helmet'; 
import { addUser, findUserByUsername, findUserByAccountNumber, findUserByIdentificationNumber } from '../db/conn.mjs';
import pkg from 'validator'; // Import the default export from validator
const { escape, trim } = pkg; // Destructure the functions you need

const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts, try again later.' });
const registerLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many registration attempts, try again later.' });

// Set security headers using helmet
router.use(helmet());

// Middleware to enforce HTTPS only in production
const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    // Use a trusted hostname instead of the potentially untrusted req.headers.host
    const host = process.env.TRUSTED_HOST || 'example.com'; // Use environment variable for host

    return res.redirect(`https://${host}${req.url}`);
  }
  next();
};

router.use(enforceHTTPS);

// Input validation patterns
const namePattern = /^[a-zA-Z\s]{1,50}$/;
const usernamePattern = /^[a-zA-Z0-9]{4,30}$/;
const accountNumberPattern = /^[0-9]{7,11}$/;
const identificationNumberPattern = /^[0-9]{13}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Input validation function
const validateInput = (input, regex) => regex.test(input);

// Registration route with input validation and rate limiting
// Registration route with enhanced input validation and sanitization
router.post('/register', registerLimiter, async (req, res) => {
  const { firstName, lastName, username, accountNumber, identificationNumber, password } = req.body;

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
      password: hashedPassword 
    };
    const result = await addUser(newUser);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route with enhanced security
router.post('/login', loginLimiter, async (req, res) => {
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
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


export default router;