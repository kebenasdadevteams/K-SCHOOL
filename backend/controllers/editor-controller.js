const { pool } = require('../config/db');

// ── EVENTS ────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const createEvent = async (req, res) => {
  const { title, title_am, description, description_am, event_date, event_time, category, image_url, link, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO events (title,title_am,description,description_am,event_date,event_time,category,image_url,link,status,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [title, title_am, description, description_am, event_date, event_time, category, image_url, link, status || 'published', req.user.id]
    );
    return res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const updateEvent = async (req, res) => {
  const { title, title_am, description, description_am, event_date, event_time, category, image_url, link, status } = req.body;
  try {
    await pool.query(
      'UPDATE events SET title=?,title_am=?,description=?,description_am=?,event_date=?,event_time=?,category=?,image_url=?,link=?,status=? WHERE id=?',
      [title, title_am, description, description_am, event_date, event_time, category, image_url, link, status, req.params.id]
    );
    return res.json({ success: true, message: 'Event updated' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const deleteEvent = async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Event deleted' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

// ── PROGRAMS ──────────────────────────────────────────
const getPrograms = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM programs ORDER BY order_index');
    return res.json({ success: true, data: rows });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const createProgram = async (req, res) => {
  const { day_en, day_am, name_en, name_am, time_display, description, order_index } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO programs (day_en,day_am,name_en,name_am,time_display,description,order_index) VALUES (?,?,?,?,?,?,?)',
      [day_en, day_am, name_en, name_am, time_display, description, order_index || 0]
    );
    return res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const updateProgram = async (req, res) => {
  const { day_en, day_am, name_en, name_am, time_display, description, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE programs SET day_en=?,day_am=?,name_en=?,name_am=?,time_display=?,description=?,is_active=? WHERE id=?',
      [day_en, day_am, name_en, name_am, time_display, description, is_active, req.params.id]
    );
    return res.json({ success: true, message: 'Program updated' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const deleteProgram = async (req, res) => {
  try {
    await pool.query('DELETE FROM programs WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Program deleted' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

// ── QUOTES ────────────────────────────────────────────
const getQuotes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const createQuote = async (req, res) => {
  const { text_en, text_am, reference } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO quotes (text_en,text_am,reference) VALUES (?,?,?)',
      [text_en, text_am, reference]
    );
    return res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const deleteQuote = async (req, res) => {
  try {
    await pool.query('DELETE FROM quotes WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Quote deleted' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

// ── SITE SETTINGS ─────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    return res.json({ success: true, data: settings });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

const updateSettings = async (req, res) => {
  const settings = req.body;
  try {
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?',
        [key, value, value]
      );
    }
    return res.json({ success: true, message: 'Settings updated' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Server error' }); }
};

module.exports = {
  getEvents, createEvent, updateEvent, deleteEvent,
  getPrograms, createProgram, updateProgram, deleteProgram,
  getQuotes, createQuote, deleteQuote,
  getSettings, updateSettings,
};
