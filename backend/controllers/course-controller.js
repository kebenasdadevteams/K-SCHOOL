const { pool } = require('../config/db');

// GET /api/v1/courses
const getAllCourses = async (req, res) => {
  try {
    const [courses] = await pool.query(
      `SELECT c.*, u.full_name as teacher_name 
       FROM courses c 
       LEFT JOIN users u ON c.teacher_id = u.id 
       ORDER BY c.created_at DESC`
    );
    return res.status(200).json({ success: true, message: 'Courses fetched', data: courses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/v1/courses/:id
const getCourseById = async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (courses.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });

    const [lessons] = await pool.query(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index', [req.params.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Course fetched',
      data: { ...courses[0], lessons },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/v1/courses (teacher/admin)
const createCourse = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, category, teacher_id) VALUES (?, ?, ?, ?)',
      [title, description, category, req.user.id]
    );
    return res.status(201).json({ success: true, message: 'Course created', data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/v1/courses/:id (teacher/admin)
const updateCourse = async (req, res) => {
  const { title, description, category } = req.body;
  try {
    await pool.query(
      'UPDATE courses SET title = ?, description = ?, category = ? WHERE id = ?',
      [title, description, category, req.params.id]
    );
    return res.status(200).json({ success: true, message: 'Course updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/v1/courses/:id (teacher/admin)
const deleteCourse = async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    return res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
