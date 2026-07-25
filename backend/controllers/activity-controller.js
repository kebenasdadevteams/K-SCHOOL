// backend/controllers/activity-controller.js
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
      `SELECT e.*, c.title, c.description, c.category, c.image_url AS thumbnail,
              u.full_name AS teacher_name
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       LEFT JOIN users u ON u.id = c.teacher_id
       WHERE e.user_id = ? AND c.status IN ('approved', 'published')
       ORDER BY e.enrolled_at DESC`,
      [userId]
    );

    return res.status(200).json({ success: true, message: 'Enrollments fetched', data: rows });
  } catch (err) {
    console.error('getMyEnrollments error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMyAssignments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query(
      `SELECT a.id,
              a.title,
              a.description,
              a.due_date,
              c.id AS course_id,
              c.title AS course,
              s.id AS submission_id,
              s.content AS submission,
              s.file_url AS fileUrl,
              s.grade,
              s.feedback,
              s.submitted_at AS submittedAt,
              CASE
                WHEN s.id IS NULL THEN 'pending'
                WHEN s.grade IS NULL THEN 'submitted'
                ELSE 'graded'
              END AS status
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       JOIN enrollments e ON e.course_id = a.course_id AND e.user_id = ?
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
       WHERE c.status = 'published'
       ORDER BY a.due_date ASC`,
      [userId, userId]
    );

    return res.status(200).json({ success: true, message: 'Assignments fetched', data: rows });
  } catch (err) {
    console.error('getMyAssignments error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { assignment_id, content, file_url } = req.body;

    if (!userId || !assignment_id || !content) {
      return res.status(400).json({ success: false, message: 'Assignment and submission content are required' });
    }

    const [assignmentRows] = await pool.query(
      `SELECT a.id, a.course_id, c.teacher_id
       FROM assignments a
       JOIN courses c ON c.id = a.course_id
       WHERE a.id = ?`,
      [assignment_id]
    );

    if (!assignmentRows.length) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const [enrollmentRows] = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, assignmentRows[0].course_id]
    );

    if (!enrollmentRows.length) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM submissions WHERE assignment_id = ? AND student_id = ?',
      [assignment_id, userId]
    );

    if (existing.length) {
      await pool.query(
        'UPDATE submissions SET content = ?, file_url = ?, submitted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [content, file_url || null, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO submissions (assignment_id, student_id, content, file_url) VALUES (?, ?, ?, ?)',
        [assignment_id, userId, content, file_url || null]
      );
    }

    if (assignmentRows[0].teacher_id) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [assignmentRows[0].teacher_id, 'New assignment submission', 'A student submitted work for review.', 'assignment']
      );
    }

    return res.status(201).json({ success: true, message: 'Assignment submitted successfully' });
  } catch (err) {
    console.error('submitAssignment error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const requestedStudentId = req.params.studentId || currentUserId;

    if (!currentUserId || !requestedStudentId) {
      return res.status(400).json({ success: false, message: 'Student identifier is required' });
    }

    const isPrivileged = req.user?.roles?.includes('teacher') || req.user?.roles?.includes('pastor') || req.user?.roles?.includes('admin') || req.user?.roles?.includes('developer');
    if (Number(requestedStudentId) !== Number(currentUserId) && !isPrivileged) {
      return res.status(403).json({ success: false, message: 'You are not allowed to view this student progress' });
    }

    const [rows] = await pool.query(
      `SELECT c.id AS course_id,
              c.title AS course_title,
              COUNT(DISTINCT a.id) AS total_assignments,
              COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN a.id END) AS submitted_assignments,
              ROUND((COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN a.id END) / NULLIF(COUNT(DISTINCT a.id), 0)) * 100) AS progress
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       LEFT JOIN assignments a ON a.course_id = c.id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
       WHERE e.user_id = ?
       GROUP BY c.id, c.title
       ORDER BY c.title ASC`,
      [requestedStudentId, requestedStudentId]
    );

    const totalAssignments = rows.reduce((sum, row) => sum + Number(row.total_assignments || 0), 0);
    const submittedAssignments = rows.reduce((sum, row) => sum + Number(row.submitted_assignments || 0), 0);
    const overallProgress = totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: 'Student progress fetched',
      data: {
        student_id: Number(requestedStudentId),
        enrolled_courses: rows.length,
        total_assignments: totalAssignments,
        submitted_assignments: submittedAssignments,
        overall_progress: overallProgress,
        courses: rows,
      },
    });
  } catch (err) {
    console.error('getStudentProgress error:', err);
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
  getMyAssignments,
  submitAssignment,
  getStudentProgress,
  sendMessage,
  getMyMessages,
  getMyNotifications,
  markNotificationsRead,
};