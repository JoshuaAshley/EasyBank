// routes/auth.js
import express from 'express';
import { registerUser, loginUser } from './UserController.mjs'; // Adjust this if needed

const router = express.Router();

// Define authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
