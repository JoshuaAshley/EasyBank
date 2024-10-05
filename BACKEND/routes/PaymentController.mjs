// PaymentController.mjs
import express from 'express';
import { addPayment, findUserByUsername, getAllPaymentsInDatabase, getPaymentsByUsername, getPaymentById, verifyPaymentById } from '../db/conn.mjs';
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
      verified: false,
      username
    };

    const result = await addPayment(username, paymentRecord); // Pass the username to the addPayment function
    res.status(201).json({ message: 'Payment record created successfully', paymentId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
  
// Endpoint to view all payments across all users
router.get('/all-payments', async (req, res) => {
    try {
      const payments = await getAllPaymentsInDatabase(); // Call the database function
      res.status(200).json({ payments }); // Return the list of payments
    } catch (error) {
      console.error('Error in /all-payments route:', error); // Log the error
      res.status(500).json({ message: 'Server error while fetching all payments', error: error.message }); // Return error to client
    }
});
  
// Endpoint to get payments for a specific user by username
router.get('/user-payments/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Validate that the username exists
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch payments for the specific user
    const payments = await getPaymentsByUsername(username);
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error in /user-payments route:', error);
    res.status(500).json({ message: 'Server error while fetching user payments', error: error.message });
  }
});

// Endpoint to get a payment by its ID
router.get('/user-payments/:username/:paymentId', async (req, res) => {
    const { username, paymentId } = req.params; // Get username and paymentId from the URL

    try {
        const payment = await getPaymentById(username, paymentId); // Fetch payment by ID
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ payment });
    } catch (error) {
        console.error('Error in /user-payments/:username/:paymentId route:', error);
        res.status(500).json({ message: 'Server error while fetching payment', error: error.message });
    }
});

// Endpoint to verify a payment
router.put('/user-payments/:username/:paymentId/verify', async (req, res) => {
    const { username, paymentId } = req.params; // Get username and paymentId from the URL
  
    try {
      // Find the payment by ID
      const payment = await getPaymentById(username, paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      // Call the method to verify the payment
      const result = await verifyPaymentById(username, paymentId);
  
      if (result.modifiedCount === 0) {
        return res.status(500).json({ message: 'Failed to verify payment' });
      }
  
      res.status(200).json({ message: 'Payment verified successfully' });
    } catch (error) {
      console.error('Error in /user-payments/:username/:paymentId/verify route:', error);
      res.status(500).json({ message: 'Server error while verifying payment', error: error.message });
    }
});
  

export default router;