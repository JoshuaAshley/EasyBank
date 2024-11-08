import request from 'supertest';
import express from 'express';
import authRouter from '../routes/auth.js';
import { addUser, findUserByUsername } from '../db/conn.mjs';
import bcrypt from 'bcrypt';

jest.mock('../db/conn.mjs'); // Mock database functions

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      findUserByUsername.mockResolvedValue(null); // No existing user
      addUser.mockResolvedValue({ insertedId: '12345' }); // Mock successful insert

      const response = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        accountNumber: '1234567890',
        identificationNumber: '1234567890123',
        accountType: 'savings',
        password: 'Password123'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return 400 if the user already exists', async () => {
      findUserByUsername.mockResolvedValue({ username: 'johndoe' }); // User exists

      const response = await request(app).post('/auth/register').send({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        accountNumber: '1234567890',
        identificationNumber: '1234567890123',
        accountType: 'savings',
        password: 'Password123'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123', 10);
      findUserByUsername.mockResolvedValue({
        username: 'johndoe',
        accountNumber: '1234567890',
        password: hashedPassword
      });

      const response = await request(app).post('/auth/login').send({
        username: 'johndoe',
        accountNumber: '1234567890',
        password: 'Password123'
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 if credentials are invalid', async () => {
      findUserByUsername.mockResolvedValue(null); // User not found

      const response = await request(app).post('/auth/login').send({
        username: 'johndoe',
        accountNumber: '1234567890',
        password: 'WrongPassword'
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
