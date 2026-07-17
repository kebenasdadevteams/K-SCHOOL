const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { pool } = require('../config/db');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');
const { sendPasswordResetEmail } = require('../services/email-service');

// POST /api/v1/auth/signup
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const { full_name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if email exists
    const [existing] = await pool.query('SELECT id FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, normalizedEmail, password_hash]
    );

    const userId = result.insertId;

    // Assign default role: student
    const [studentRole] = await pool.query('SELECT id FROM roles WHERE name = ?', ['student']);
    if (studentRole.length > 0) {
      await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, studentRole[0].id]);
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Please login.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// POST /api/v1/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Load roles
    const [roleRows] = await pool.query(
      `SELECT r.name FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = ?`,
      [user.id]
    );

    const roles = roleRows.map((r) => r.name);

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, roles });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          roles,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    return res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, full_name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [roleRows] = await pool.query(
      `SELECT r.name FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = ?`,
      [req.user.id]
    );

    const roles = roleRows.map((r) => r.name);

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { ...users[0], roles },
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/v1/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const [users] = await pool.query('SELECT id, full_name, email FROM users WHERE email = ?', [email]);

    // Always return success to prevent email enumeration
    if (users.length === 0) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate old tokens
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = ?', [user.id]);

    // Store new token
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, resetLink, user.full_name);

    return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/v1/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, message: 'Token and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const resetRecord = rows[0];
    const password_hash = await bcrypt.hash(password, 12);

    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, resetRecord.user_id]);
    await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE id = ?', [resetRecord.id]);

    return res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/v1/auth/profile - Update user profile (name, email, phone, profile_picture)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { full_name, email, phone_number, profile_picture } = req.body;

    // Check if new email is already taken by another user
    if (email) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    // Update user profile
    const updateFields = [];
    const updateValues = [];

    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone_number) {
      updateFields.push('phone_number = ?');
      updateValues.push(phone_number);
    }
    if (profile_picture) {
      updateFields.push('profile_picture = ?');
      updateValues.push(profile_picture);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(userId);
    await pool.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    // Fetch updated user
    const [users] = await pool.query('SELECT id, full_name, email, phone_number, profile_picture FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: users[0],
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/v1/auth/change-password - Change user password
const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // Fetch user and verify current password
    const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(current_password, users[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const new_password_hash = await bcrypt.hash(new_password, 12);

    // Update password
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [new_password_hash, userId]);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    console.error('changePassword error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/v1/auth/preferences - Update user preferences (theme, language, font_size)
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { theme, language, font_size } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (theme && ['light', 'dark'].includes(theme)) {
      updateFields.push('theme = ?');
      updateValues.push(theme);
    }
    if (language) {
      updateFields.push('language = ?');
      updateValues.push(language);
    }
    if (font_size && ['small', 'medium', 'large'].includes(font_size)) {
      updateFields.push('font_size = ?');
      updateValues.push(font_size);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(userId);
    await pool.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    // Fetch updated preferences
    const [users] = await pool.query('SELECT theme, language, font_size FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: users[0],
    });
  } catch (err) {
    console.error('updatePreferences error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { signup, login, getMe, forgotPassword, resetPassword, updateProfile, changePassword, updatePreferences };
