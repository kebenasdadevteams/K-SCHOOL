const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// POST /api/v1/users  (admin only)
const createUser = async (req, res) => {
  const { full_name, email, password, roles, role } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const roleNames = Array.isArray(roles) && roles.length > 0 ? roles : role ? [role] : ['student'];

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, password_hash]
    );

    const userId = result.insertId;
    for (const roleName of roleNames) {
      const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
      if (roleRows.length > 0) {
        await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleRows[0].id]);
      }
    }

    const [roleRows] = await pool.query(
      `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?`,
      [userId]
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: userId,
        full_name,
        email,
        roles: roleRows.map((r) => r.name),
      },
    });
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/users  (admin only)
const getAllUsers = async (req, res) => {
  try {
    const demoEmails = [
      'admin@kebenasdachurch.org',
      'pastor@kebenasdachurch.org',
      'editor@kebenasdachurch.org',
      'teacher@kebenasdachurch.org',
      'developer@kebenasdachurch.org',
      'student@kebenasdachurch.org',
    ];

    const placeholders = demoEmails.map(() => '?').join(', ');
    const [users] = await pool.query(
      `SELECT id, full_name, email, created_at FROM users WHERE LOWER(email) NOT IN (${placeholders}) ORDER BY created_at DESC`,
      demoEmails.map((email) => email.toLowerCase())
    );

    // Load roles for each user
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const [roleRows] = await pool.query(
          `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?`,
          [user.id]
        );
        return { ...user, roles: roleRows.map((r) => r.name) };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: usersWithRoles,
    });
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/users/:id
const getUserById = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [roleRows] = await pool.query(
      `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?`,
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { ...users[0], roles: roleRows.map((r) => r.name) },
    });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/v1/users/:id/roles  (admin only)
const updateUserRoles = async (req, res) => {
  const { roles, role } = req.body;
  const roleNames = Array.isArray(roles) ? roles : role ? [role] : [];

  if (!Array.isArray(roleNames) || roleNames.length === 0) {
    return res.status(400).json({ success: false, message: 'Roles must be provided' });
  }

  try {
    const userId = req.params.id;

    // Delete existing roles
    await pool.query('DELETE FROM user_roles WHERE user_id = ?', [userId]);

    // Get role IDs
    for (const roleName of roleNames) {
      const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
      if (roleRows.length > 0) {
        await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleRows[0].id]);
      }
    }

    const [updatedRoleRows] = await pool.query(
      `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Roles updated successfully',
      data: { roles: updatedRoleRows.map((r) => r.name) },
    });
  } catch (err) {
    console.error('updateUserRoles error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/v1/users/:id  (admin only)
const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM user_roles WHERE user_id = ?', [req.params.id]);
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUserRoles, deleteUser };
