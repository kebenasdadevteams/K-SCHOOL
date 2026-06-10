const { pool } = require('../config/db');

// ── POSTS ──────────────────────────────────────────────
const getAllPosts = async (req, res) => {
  try {
    const [posts] = await pool.query(
      `SELECT p.*, u.full_name as author_name FROM posts p 
       LEFT JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC`
    );
    return res.status(200).json({ success: true, message: 'Posts fetched', data: posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  const { title, content, category, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO posts (title, content, category, status, author_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, category, status || 'draft', req.user.id]
    );
    return res.status(201).json({ success: true, message: 'Post created', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  const { title, content, category, status } = req.body;
  try {
    await pool.query(
      'UPDATE posts SET title = ?, content = ?, category = ?, status = ? WHERE id = ?',
      [title, content, category, status, req.params.id]
    );
    return res.status(200).json({ success: true, message: 'Post updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    return res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── PODCASTS ───────────────────────────────────────────
const getAllPodcasts = async (req, res) => {
  try {
    const [podcasts] = await pool.query('SELECT * FROM podcasts ORDER BY created_at DESC');
    return res.status(200).json({ success: true, message: 'Podcasts fetched', data: podcasts });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createPodcast = async (req, res) => {
  const { title, description, audio_url, duration } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO podcasts (title, description, audio_url, duration, author_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, audio_url, duration, req.user.id]
    );
    return res.status(201).json({ success: true, message: 'Podcast created', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllPosts, createPost, updatePost, deletePost, getAllPodcasts, createPodcast };
