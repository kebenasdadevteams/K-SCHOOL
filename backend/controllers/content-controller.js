const { pool } = require('../config/db');

const sendNotification = async (userId, title, message, type = 'info') => {
  if (!userId) return;

  await pool.query(
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
    [userId, title, message, type]
  );
};

const notifyAdmins = async (title, message, type = 'content_review') => {
  try {
    const [adminRows] = await pool.query(
      `SELECT DISTINCT u.id
       FROM users u
       JOIN user_roles ur ON ur.user_id = u.id
       JOIN roles r ON r.id = ur.role_id
       WHERE r.name = 'admin'`
    );

    for (const admin of adminRows) {
      await sendNotification(admin.id, title, message, type);
    }
  } catch (err) {
    console.error('notifyAdmins error:', err);
  }
};

const normalizeContentRows = (rows) =>
  rows.map((row) => ({
    ...row,
    type: row.type,
    author_name: row.author_name || 'Unknown',
    body: row.body || '',
    category: row.category || 'General',
  }));

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

    if ((status || 'draft') === 'draft') {
      await notifyAdmins(
        'New content submitted for review',
        `${title} was submitted for admin verification.`,
        'content_review'
      );
    }

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
    const [podcasts] = await pool.query(
      `SELECT p.*, u.full_name as author_name FROM podcasts p
       LEFT JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC`
    );
    return res.status(200).json({ success: true, message: 'Podcasts fetched', data: podcasts });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createPodcast = async (req, res) => {
  const { title, description, audio_url, duration, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO podcasts (title, description, audio_url, duration, author_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, audio_url, duration, req.user.id, status || 'draft']
    );

    if ((status || 'draft') === 'draft') {
      await notifyAdmins(
        'New podcast submitted for review',
        `${title} was submitted for admin verification.`,
        'content_review'
      );
    }

    return res.status(201).json({ success: true, message: 'Podcast created', data: { id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllContent = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, content AS body, category, status, author_id, created_at, updated_at, author_name, 'post' AS type
       FROM (
         SELECT p.id, p.title, p.content, p.category, p.status, p.author_id, p.created_at, p.updated_at, u.full_name AS author_name
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
       ) combined
       UNION ALL
       SELECT id, title, description AS body, 'Podcast' AS category, status, author_id, created_at, created_at AS updated_at, author_name, 'podcast' AS type
       FROM (
         SELECT pod.id, pod.title, pod.description, pod.status, pod.author_id, pod.created_at, u.full_name AS author_name
         FROM podcasts pod
         LEFT JOIN users u ON u.id = pod.author_id
       ) pod_combined
       UNION ALL
       SELECT id, title, description AS body, category, status, teacher_id AS author_id, created_at, updated_at, author_name, 'course' AS type
       FROM (
         SELECT c.id, c.title, c.description, c.category, c.status, c.teacher_id, c.created_at, c.updated_at, u.full_name AS author_name
         FROM courses c
         LEFT JOIN users u ON u.id = c.teacher_id
       ) course_combined
       ORDER BY created_at DESC`
    );

    return res.status(200).json({ success: true, message: 'All content fetched', data: normalizeContentRows(rows) });
  } catch (err) {
    console.error('getAllContent error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getReviewQueue = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, content AS body, category, status, author_id, created_at, updated_at, author_name, 'post' AS type
       FROM (
         SELECT p.id, p.title, p.content, p.category, p.status, p.author_id, p.created_at, p.updated_at, u.full_name AS author_name
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         WHERE p.status = 'draft'
       ) combined
       UNION ALL
       SELECT id, title, description AS body, 'Podcast' AS category, status, author_id, created_at, created_at AS updated_at, author_name, 'podcast' AS type
       FROM (
         SELECT pod.id, pod.title, pod.description, pod.status, pod.author_id, pod.created_at, u.full_name AS author_name
         FROM podcasts pod
         LEFT JOIN users u ON u.id = pod.author_id
         WHERE pod.status = 'draft'
       ) pod_combined
       UNION ALL
       SELECT id, title, description AS body, category, status, teacher_id AS author_id, created_at, updated_at, author_name, 'course' AS type
       FROM (
         SELECT c.id, c.title, c.description, c.category, c.status, c.teacher_id, c.created_at, c.updated_at, u.full_name AS author_name
         FROM courses c
         LEFT JOIN users u ON u.id = c.teacher_id
         WHERE c.status = 'draft'
       ) course_combined
       ORDER BY created_at DESC`
    );

    return res.status(200).json({ success: true, message: 'Review queue fetched', data: normalizeContentRows(rows) });
  } catch (err) {
    console.error('getReviewQueue error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getContentById = async (req, res) => {
  const { type, id } = req.params;

  try {
    if (type === 'post') {
      const [rows] = await pool.query(
        `SELECT p.id, p.title, p.content AS body, p.category, p.status, p.author_id, p.created_at, p.updated_at, u.full_name AS author_name, 'post' AS type
         FROM posts p
         LEFT JOIN users u ON u.id = p.author_id
         WHERE p.id = ?`,
        [id]
      );
      return rows.length ? res.status(200).json({ success: true, data: normalizeContentRows(rows)[0] }) : res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (type === 'podcast') {
      const [rows] = await pool.query(
        `SELECT pod.id, pod.title, pod.description AS body, 'Podcast' AS category, pod.status, pod.author_id, pod.created_at, pod.created_at AS updated_at, u.full_name AS author_name, 'podcast' AS type
         FROM podcasts pod
         LEFT JOIN users u ON u.id = pod.author_id
         WHERE pod.id = ?`,
        [id]
      );
      return rows.length ? res.status(200).json({ success: true, data: normalizeContentRows(rows)[0] }) : res.status(404).json({ success: false, message: 'Podcast not found' });
    }

    if (type === 'course') {
      const [rows] = await pool.query(
        `SELECT c.id, c.title, c.description AS body, c.category, c.status, c.teacher_id AS author_id, c.created_at, c.updated_at, u.full_name AS author_name, 'course' AS type
         FROM courses c
         LEFT JOIN users u ON u.id = c.teacher_id
         WHERE c.id = ?`,
        [id]
      );
      return rows.length ? res.status(200).json({ success: true, data: normalizeContentRows(rows)[0] }) : res.status(404).json({ success: false, message: 'Course not found' });
    }

    return res.status(400).json({ success: false, message: 'Unsupported content type' });
  } catch (err) {
    console.error('getContentById error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateContentByType = async (req, res) => {
  const { type, id } = req.params;
  const { title, body, category, status, audio_url } = req.body;

  try {
    if (type === 'post') {
      await pool.query(
        'UPDATE posts SET title = ?, content = ?, category = ?, status = ? WHERE id = ?',
        [title, body, category, status || 'draft', id]
      );
      return res.status(200).json({ success: true, message: 'Post updated' });
    }

    if (type === 'podcast') {
      await pool.query(
        'UPDATE podcasts SET title = ?, description = ?, audio_url = ?, status = ? WHERE id = ?',
        [title, body, audio_url, status || 'draft', id]
      );
      return res.status(200).json({ success: true, message: 'Podcast updated' });
    }

    if (type === 'course') {
      await pool.query(
        'UPDATE courses SET title = ?, description = ?, category = ?, status = ? WHERE id = ?',
        [title, body, category, status || 'draft', id]
      );
      return res.status(200).json({ success: true, message: 'Course updated' });
    }

    return res.status(400).json({ success: false, message: 'Unsupported content type' });
  } catch (err) {
    console.error('updateContentByType error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const reviewContent = async (req, res) => {
  const { type, id } = req.params;
  const { action = 'publish', feedback, title, body, category, audio_url } = req.body;

  try {
    const contentRecord = await pool.query(
      type === 'post'
        ? 'SELECT title, content, category, author_id FROM posts WHERE id = ?'
        : type === 'podcast'
          ? 'SELECT title, description AS content, audio_url, author_id FROM podcasts WHERE id = ?'
          : 'SELECT title, description AS content, category, teacher_id AS author_id FROM courses WHERE id = ?'
      , [id]
    );

    const record = contentRecord[0]?.[0];
    if (!record) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    if (type === 'post') {
      await pool.query(
        'UPDATE posts SET title = ?, content = ?, category = ?, status = ? WHERE id = ?',
        [title || record.title, body || record.content, category || record.category, action === 'publish' ? 'published' : 'draft', id]
      );
    } else if (type === 'podcast') {
      await pool.query(
        'UPDATE podcasts SET title = ?, description = ?, audio_url = ?, status = ? WHERE id = ?',
        [title || record.title, body || record.content, audio_url || record.audio_url, action === 'publish' ? 'published' : 'draft', id]
      );
    } else if (type === 'course') {
      await pool.query(
        'UPDATE courses SET title = ?, description = ?, category = ?, status = ? WHERE id = ?',
        [title || record.title, body || record.content, category || record.category, action === 'publish' ? 'published' : 'draft', id]
      );
    }

    if (action === 'publish') {
      await sendNotification(
        record.author_id,
        'Content published',
        `${title || record.title} has been verified and published successfully.`,
        'content_publish'
      );
    }

    if (action === 'reject' && feedback) {
      await sendNotification(
        record.author_id,
        'Content needs correction',
        `${title || record.title} needs attention before it can be published. Admin note: ${feedback}`,
        'content_feedback'
      );
    }

    return res.status(200).json({ success: true, message: action === 'publish' ? 'Content published' : 'Feedback sent' });
  } catch (err) {
    console.error('reviewContent error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteContentByType = async (req, res) => {
  const { type, id } = req.params;

  try {
    if (type === 'post') {
      await pool.query('DELETE FROM posts WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Post deleted' });
    }

    if (type === 'podcast') {
      await pool.query('DELETE FROM podcasts WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Podcast deleted' });
    }

    if (type === 'course') {
      await pool.query('DELETE FROM courses WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Course deleted' });
    }

    return res.status(400).json({ success: false, message: 'Unsupported content type' });
  } catch (err) {
    console.error('deleteContentByType error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getAllPodcasts,
  createPodcast,
  getAllContent,
  getReviewQueue,
  getContentById,
  updateContentByType,
  reviewContent,
  deleteContentByType,
};
