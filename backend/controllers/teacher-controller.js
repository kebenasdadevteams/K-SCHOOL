const { pool } = require('../config/db');

const getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user?.id;

    const [[courseCount]] = await pool.query(
      'SELECT COUNT(*) AS activeCourses FROM courses WHERE teacher_id = ?',
      [teacherId]
    );

    const [[studentCount]] = await pool.query(
      `SELECT COUNT(DISTINCT e.user_id) AS totalStudents
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?`,
      [teacherId]
    );

    const [[pendingReviews]] = await pool.query(
      `SELECT COUNT(*) AS pendingReviews
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       WHERE c.teacher_id = ?
         AND s.grade IS NULL`,
      [teacherId]
    );

    const [[completedEnrollments]] = await pool.query(
      `SELECT
         SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) AS completedCount,
         COUNT(*) AS totalEnrollments
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?`,
      [teacherId]
    );

    const completionRate = completedEnrollments.totalEnrollments
      ? Math.round((completedEnrollments.completedCount / completedEnrollments.totalEnrollments) * 100)
      : 0;

    return res.status(200).json({
      success: true,
      message: 'Teacher stats fetched',
      data: {
        totalStudents: studentCount.totalStudents || 0,
        activeCourses: courseCount.activeCourses || 0,
        pendingReviews: pendingReviews.pendingReviews || 0,
        completionRate,
      },
    });
  } catch (err) {
    console.error('getTeacherStats error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user?.id;
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email,
              COUNT(DISTINCT e.course_id) AS courses,
              SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) AS completedCourses,
              ROUND(
                CASE WHEN COUNT(DISTINCT e.course_id) = 0 THEN 0
                     ELSE SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) / COUNT(DISTINCT e.course_id) * 100
                END
              ) AS progress
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users u ON u.id = e.user_id
       WHERE c.teacher_id = ?
       GROUP BY u.id
       ORDER BY u.full_name ASC`,
      [teacherId]
    );

    return res.status(200).json({ success: true, message: 'Teacher students fetched', data: rows });
  } catch (err) {
    console.error('getTeacherStudents error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user?.id;

    const [rows] = await pool.query(
      `SELECT a.id,
              a.title,
              a.description,
              a.due_date,
              c.id AS course_id,
              c.title AS course,
              COUNT(s.id) AS submissions
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       LEFT JOIN submissions s ON s.assignment_id = a.id
       WHERE c.teacher_id = ?
       GROUP BY a.id
       ORDER BY a.due_date ASC`,
      [teacherId]
    );

    return res.status(200).json({ success: true, message: 'Teacher assignments fetched', data: rows });
  } catch (err) {
    console.error('getTeacherAssignments error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTeacherSubmissions = async (req, res) => {
  try {
    const teacherId = req.user?.id;

    const [rows] = await pool.query(
      `SELECT s.id,
              s.content,
              s.file_url AS fileUrl,
              s.grade,
              s.feedback,
              s.submitted_at AS submittedAt,
              a.id AS assignment_id,
              a.title AS assignment_title,
              c.id AS course_id,
              c.title AS course,
              u.id AS student_id,
              u.full_name AS student_name,
              u.email AS student_email,
              CASE WHEN s.grade IS NULL THEN 'pending' ELSE 'graded' END AS status
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN courses c ON a.course_id = c.id
       JOIN users u ON s.student_id = u.id
       WHERE c.teacher_id = ?
       ORDER BY s.submitted_at DESC`,
      [teacherId]
    );

    return res.status(200).json({ success: true, message: 'Teacher submissions fetched', data: rows });
  } catch (err) {
    console.error('getTeacherSubmissions error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getTeacherStats,
  getTeacherStudents,
  getTeacherAssignments,
  getTeacherSubmissions,
};
