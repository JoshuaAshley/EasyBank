// routes/payments.js
import express from 'express';
import {
  addPayment,
  findUserByUsername,
  getAllPaymentsInDatabase,
  getPaymentsByUsername,
  getPaymentById,
  verifyPaymentById,
  declinePaymentById,
} from './PaymentController.mjs'; // Adjust this if needed

const router = express.Router();

// Define payment-related routes
router.post('/create', addPayment);
router.get('/all-payments', getAllPaymentsInDatabase);
router.get('/user-payments/:username', getPaymentsByUsername);
router.get('/user-payments/:username/:paymentId', getPaymentById);
router.put('/user-payments/:username/:paymentId/verify', verifyPaymentById);
router.put('/user-payments/:username/:paymentId/decline', declinePaymentById);

export default router;
