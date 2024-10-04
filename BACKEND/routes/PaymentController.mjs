// PaymentController.mjs
import express from 'express';
import { addPayment, findUserByUsername } from '../db/conn.mjs'; // Import your DB functions
import rateLimit from 'express-rate-limit'; 
import helmet from 'helmet'; 
import pkg from 'validator'; // Import the default export from validator
const { escape, trim } = pkg; // Destructure the functions you need

const router = express.Router();
const paymentLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many payment submissions, try again later.' });

// Set security headers using helmet
router.use(helmet());

// Input validation patterns
const amountPattern = /^\d+(\.\d{1,2})?$/; // Positive decimal number with optional two decimal places
const currencyPattern = /^[A-Z]{3}$/; // 3-letter currency code (e.g., USD, EUR)
const providerPattern = /^[a-zA-Z\s]{1,50}$/; // Provider name (1-50 characters)
const namePattern = /^[a-zA-Z\s]{1,100}$/; // Account holder name (1-100 characters)
const bankPattern = /^[a-zA-Z\s]{1,100}$/; // Bank name (1-100 characters)
const accountNumberPattern = /^[0-9]{10,12}$/; // Account number (10-12 digits)
const swiftCodePattern = /^[A-Z0-9]{8,11}$/; // SWIFT code (8-11 characters)

// Input validation function
const validateInput = (input, regex) => regex.test(input);

// Payment creation route with input validation
router.post('/create', paymentLimiter, async (req, res) => {
  const { amount, currency, provider, accountHolderName, bank, accountNumber, swiftCode, username } = req.body;

  // Sanitize inputs
  const sanitizedAccountHolderName = escape(trim(accountHolderName));
  const sanitizedBank = escape(trim(bank));

  // Validate inputs
  if (!validateInput(amount, amountPattern) ||
      !validateInput(currency, currencyPattern) ||
      !validateInput(provider, providerPattern) ||
      !validateInput(sanitizedAccountHolderName, namePattern) ||
      !validateInput(sanitizedBank, bankPattern) ||
      !validateInput(accountNumber, accountNumberPattern) ||
      !validateInput(swiftCode, swiftCodePattern)) {
    return res.status(400).json({ message: 'Invalid input format' });
  }

  try {
    // Find the user
    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create payment record
    const paymentRecord = {
      amount,
      currency,
      provider,
      accountHolderName: sanitizedAccountHolderName,
      bank: sanitizedBank,
      accountNumber,
      swiftCode,
      username // Reference to the user
    };

    const result = await addPayment(username, paymentRecord); // Pass the username to the addPayment function
    res.status(201).json({ message: 'Payment record created successfully', paymentId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;