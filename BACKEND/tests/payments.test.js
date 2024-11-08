import request from 'supertest';
import express from 'express';
import paymentRouter from '../routes/payments.js';
import {
  addPayment,
  findUserByUsername,
  getAllPaymentsInDatabase,
  getPaymentsByUsername,
  getPaymentById,
  verifyPaymentById,
  declinePaymentById
} from '../db/conn.mjs';

jest.mock('../db/conn.mjs'); // Mock all database functions

const app = express();
app.use(express.json());
app.use('/payments', paymentRouter);

describe('Payment Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /payments/create', () => {
    it('should create a new payment successfully', async () => {
      findUserByUsername.mockResolvedValue({ username: 'johndoe' }); // Mock user found
      addPayment.mockResolvedValue({ insertedId: 'payment123' }); // Mock payment insert

      const response = await request(app).post('/payments/create').send({
        amount: '100.00',
        currency: 'USD',
        provider: 'Visa',
        accountHolderName: 'John Doe',
        bank: 'Test Bank',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        username: 'johndoe'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Payment record created successfully');
      expect(response.body.paymentId).toBe('payment123');
    });

    it('should return 400 if input validation fails', async () => {
      const response = await request(app).post('/payments/create').send({
        amount: 'invalidAmount',
        currency: 'USD',
        provider: 'Visa',
        accountHolderName: 'John Doe',
        bank: 'Test Bank',
        accountNumber: '1234567890',
        swiftCode: 'ABCDUS33',
        username: 'johndoe'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid input format');
    });
  });

  describe('GET /payments/all-payments', () => {
    it('should fetch all payments successfully', async () => {
      getAllPaymentsInDatabase.mockResolvedValue([{ paymentId: 'payment123' }]); // Mock payments

      const response = await request(app).get('/payments/all-payments');

      expect(response.status).toBe(200);
      expect(response.body.payments).toHaveLength(1);
      expect(response.body.payments[0].paymentId).toBe('payment123');
    });
  });

  describe('GET /payments/user-payments/:username', () => {
    it('should fetch payments by username', async () => {
      findUserByUsername.mockResolvedValue({ username: 'johndoe' });
      getPaymentsByUsername.mockResolvedValue([{ paymentId: 'payment123' }]); // Mock user payments

      const response = await request(app).get('/payments/user-payments/johndoe');

      expect(response.status).toBe(200);
      expect(response.body.payments).toHaveLength(1);
      expect(response.body.payments[0].paymentId).toBe('payment123');
    });

    it('should return 404 if user is not found', async () => {
      findUserByUsername.mockResolvedValue(null);

      const response = await request(app).get('/payments/user-payments/johndoe');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('GET /payments/user-payments/:username/:paymentId', () => {
    it('should fetch a payment by ID', async () => {
      getPaymentById.mockResolvedValue({ paymentId: 'payment123' });

      const response = await request(app).get('/payments/user-payments/johndoe/payment123');

      expect(response.status).toBe(200);
      expect(response.body.payment.paymentId).toBe('payment123');
    });

    it('should return 404 if payment is not found', async () => {
      getPaymentById.mockResolvedValue(null);

      const response = await request(app).get('/payments/user-payments/johndoe/payment123');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Payment not found');
    });
  });

  describe('PUT /payments/user-payments/:username/:paymentId/verify', () => {
    it('should verify a payment successfully', async () => {
      getPaymentById.mockResolvedValue({ paymentId: 'payment123' });
      verifyPaymentById.mockResolvedValue({ modifiedCount: 1 });

      const response = await request(app).put('/payments/user-payments/johndoe/payment123/verify');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Payment verified successfully');
    });

    it('should return 404 if payment is not found', async () => {
      getPaymentById.mockResolvedValue(null);

      const response = await request(app).put('/payments/user-payments/johndoe/payment123/verify');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Payment not found');
    });
  });

  describe('PUT /payments/user-payments/:username/:paymentId/decline', () => {
    it('should decline a payment successfully', async () => {
      getPaymentById.mockResolvedValue({ paymentId: 'payment123' });
      declinePaymentById.mockResolvedValue({ modifiedCount: 1 });

      const response = await request(app).put('/payments/user-payments/johndoe/payment123/decline');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Payment declined successfully');
    });

    it('should return 404 if payment is not found', async () => {
      getPaymentById.mockResolvedValue(null);

      const response = await request(app).put('/payments/user-payments/johndoe/payment123/decline');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Payment not found');
    });
  });
});
