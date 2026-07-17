const express = require('express');
const { body } = require('express-validator');
const { signup, login, getMe, forgotPassword, resetPassword, updateProfile, changePassword, updatePreferences } = require('../controllers/auth-controller');
const { authenticate } = require('../middleware/auth-middleware');

const router = express.Router();

// POST /api/v1/auth/signup
router.post(
  '/signup',
  [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match');
      return true;
    }),
  ],
  signup
);

// POST /api/v1/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// GET /api/v1/auth/me
router.get('/me', authenticate, getMe);

// PUT /api/v1/auth/profile - Update profile
router.put('/profile', authenticate, updateProfile);

// PUT /api/v1/auth/change-password - Change password
router.put('/change-password', authenticate, changePassword);

// PUT /api/v1/auth/preferences - Update preferences
router.put('/preferences', authenticate, updatePreferences);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;
