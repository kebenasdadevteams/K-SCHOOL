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

// DEVOTIONALS - Public (FIXED - Added author_name)
const getPublicDevotionals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.id, d.title, d.header, d.subtitle, d.slug, d.category, 
              d.verse_reference, d.verse_text, 
              LEFT(d.content, 1000) as excerpt, 
              d.featured_image, d.status, d.publish_at, d.published_at,
              d.is_featured_today, d.created_at,
              u.full_name as author_name
       FROM devotionals d
       LEFT JOIN users u ON d.author_id = u.id
       WHERE d.status = 'published' 
       ORDER BY d.published_at DESC 
       LIMIT 50`
    );
    
    // Format dates for frontend
    const formattedRows = rows.map(row => ({
      ...row,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      created_at: new Date(row.created_at).toISOString(),
      is_featured_today: row.is_featured_today === 1 || row.is_featured_today === true
    }));
    
    return res.json({ success: true, data: formattedRows });
  } catch (err) { 
    console.error('Error fetching public devotionals:', err); 
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET today's devotional (FIXED - Added author_name)
const getTodayDevotional = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d
       LEFT JOIN users u ON d.author_id = u.id
       WHERE d.is_featured_today = TRUE 
       LIMIT 1`
    );
    
    if (rows.length === 0) {
      const [fallback] = await pool.query(
        `SELECT d.*, u.full_name as author_name 
         FROM devotionals d
         LEFT JOIN users u ON d.author_id = u.id
         WHERE d.status = 'published' 
         ORDER BY d.published_at DESC 
         LIMIT 1`
      );
      return res.json({ success: true, data: fallback[0] || null });
    }
    
    // Format dates
    const formattedRow = {
      ...rows[0],
      published_at: rows[0].published_at ? new Date(rows[0].published_at).toISOString() : null,
      created_at: new Date(rows[0].created_at).toISOString(),
      is_featured_today: rows[0].is_featured_today === 1 || rows[0].is_featured_today === true
    };
    
    return res.json({ success: true, data: formattedRow });
  } catch (err) { 
    console.error('Error fetching today\'s devotional:', err); 
    return res.status(500).json({ success: false, message: 'Server error' }); 
  }
};

// GET devotional by slug
const getDevotionalBySlug = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d
       LEFT JOIN users u ON d.author_id = u.id
       WHERE d.slug = ? AND d.status = 'published' 
       LIMIT 1`,
      [req.params.slug]
    );
    
    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    
    const formattedRow = {
      ...rows[0],
      published_at: rows[0].published_at ? new Date(rows[0].published_at).toISOString() : null,
      created_at: new Date(rows[0].created_at).toISOString(),
      is_featured_today: rows[0].is_featured_today === 1 || rows[0].is_featured_today === true
    };
    
    return res.json({ success: true, data: formattedRow });
  } catch (err) { 
    console.error('Error fetching devotional by slug:', err); 
    return res.status(500).json({ success: false, message: 'Server error' }); 
  }
};

module.exports = {
  getEvents,
  getPrograms,
  getQuotes,
  getPublicPosts,
  getPublicPodcasts,
  getSettings,
  getPublicDevotionals,
  getTodayDevotional,
  getDevotionalBySlug,
};