const { pool } = require('../config/db');

// GET /api/v1/users  (admin only)
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC'
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
  const { roles } = req.body;

  if (!Array.isArray(roles)) {
    return res.status(400).json({ success: false, message: 'Roles must be an array' });
  }

  try {
    const userId = req.params.id;

    // Delete existing roles
    await pool.query('DELETE FROM user_roles WHERE user_id = ?', [userId]);

    // Get role IDs
    for (const roleName of roles) {
      const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
      if (roleRows.length > 0) {
        await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleRows[0].id]);
      }
    }

    return res.status(200).json({ success: true, message: 'Roles updated successfully' });
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

module.exports = { getAllUsers, getUserById, updateUserRoles, deleteUser };
