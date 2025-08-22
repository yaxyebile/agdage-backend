import express from 'express';
import {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
  createAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/create-admin', createAdmin); // New admin creation route
router.get('/me', protect, getProfile);
router.post('/logout', logout);
router.put('/profile', protect, updateProfile);

export default router;