const { pool } = require('../config/db');

const getMembers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM members ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const createMember = async (req, res) => {
  const { full_name, email, phone, address, membership_date, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO members (full_name,email,phone,address,membership_date,status) VALUES (?,?,?,?,?,?)',
      [full_name, email, phone, address, membership_date || null, status || 'active']
    );
    return res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const deleteMember = async (req, res) => {
  try {
    await pool.query('DELETE FROM members WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Member removed' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

module.exports = { getMembers, createMember, deleteMember };
