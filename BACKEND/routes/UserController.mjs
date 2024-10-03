import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit'; // Import express-rate-limit
import { addUser, findUserByUsername, findUserByAccountNumber } from '../db/conn.mjs'; // Import your functions

const router = express.Router();

// Brute-force protection (limit to 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 5 requests per `window` (15 minutes)
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 3 registration requests per `window`
  message: 'Too many registration attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration route
router.post('/register', registerLimiter, async (req, res) => {
  const { firstName, lastName, username, identificationNumber, accountNumber, accountType, password } = req.body;

  try {
    // Check if username or account number already exists
    const existingUser = await findUserByUsername(username) || await findUserByAccountNumber(accountNumber);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or account number already exists' });
    }

    // Hash and salt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object
    const newUser = {
      firstName,
      lastName,
      username,
      identificationNumber,
      accountNumber,
      accountType,
      password: hashedPassword
    };

    // Add the user to the database
    const result = await addUser(newUser);

    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route with brute force protection
router.post('/login', loginLimiter, async (req, res) => {
  const { username, accountNumber, password } = req.body;

  try {
    // Find the user by username
    const user = await findUserByUsername(username);

    if (!user || user.accountNumber !== accountNumber) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "this_is_not_a_real_secret", { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;