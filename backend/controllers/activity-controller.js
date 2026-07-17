const { pool } = require('../config/db');

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { course_id } = req.body;

    if (!userId || !course_id) {
      return res.status(400).json({ success: false, message: 'User and course are required' });
    }

    const [existing] = await pool.query('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, course_id]);
    if (existing.length > 0) {
      return res.status(200).json({ success: true, message: 'Already enrolled', data: { enrolled: true } });
    }

    await pool.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [userId, course_id]);

    await pool.query('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)', [
      userId,
      'Course enrolled',
      'You have successfully enrolled in the selected course.',
      'enrollment',
    ]);

    return res.status(201).json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    console.error('enrollCourse error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query(
      `SELECT e.*, c.title, c.description, c.category
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );

    return res.status(200).json({ success: true, message: 'Enrollments fetched', data: rows });
  } catch (err) {
    console.error('getMyEnrollments error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { receiver_id, content, attachment_url } = req.body;

    if (!userId || !receiver_id || !content) {
      return res.status(400).json({ success: false, message: 'Receiver and content are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content, attachment_url) VALUES (?, ?, ?, ?)',
      [userId, receiver_id, content, attachment_url || null]
    );

    await pool.query('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)', [
      receiver_id,
      'New message',
      content,
      'message',
    ]);

    return res.status(201).json({ success: true, message: 'Message sent', data: { id: result.insertId } });
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyMessages = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query(
      `SELECT m.*, u.full_name as sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      [userId]
    );

    return res.status(200).json({ success: true, message: 'Messages fetched', data: rows });
  } catch (err) {
    console.error('getMyMessages error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    return res.status(200).json({ success: true, message: 'Notifications fetched', data: rows });
  } catch (err) {
    console.error('getMyNotifications error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [userId]);
    return res.status(200).json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    console.error('markNotificationsRead error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  sendMessage,
  getMyMessages,
  getMyNotifications,
  markNotificationsRead,
};
