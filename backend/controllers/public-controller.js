const { pool } = require('../config/db');

// GET /api/v1/public/events
const getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM events WHERE status='published' ORDER BY event_date DESC LIMIT 20"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/public/programs
const getPrograms = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM programs WHERE is_active=TRUE ORDER BY order_index'
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/public/quotes
const getQuotes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM quotes WHERE is_active=TRUE ORDER BY RAND() LIMIT 1'
    );
    return res.json({ success: true, data: rows[0] || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/public/posts
const getPublicPosts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.*, u.full_name as author_name FROM posts p LEFT JOIN users u ON p.author_id=u.id WHERE p.status='published' ORDER BY p.created_at DESC LIMIT 10"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/public/podcasts
const getPublicPodcasts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM podcasts WHERE status='published' ORDER BY created_at DESC LIMIT 10"
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/public/settings
const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    return res.json({ success: true, data: settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getEvents, getPrograms, getQuotes, getPublicPosts, getPublicPodcasts, getSettings };
