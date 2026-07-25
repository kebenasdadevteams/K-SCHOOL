const { pool } = require('../config/db');

const parseJSONField = (value) => {
  if (value == null) return null;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

const normalizeCourseRow = (course) => ({
  ...course,
  imageUrl: course.image_url || course.imageUrl || '',
  sections: parseJSONField(course.sections) || [],
  materials: parseJSONField(course.materials) || [],
  tags: parseJSONField(course.tags) || [],
  prerequisites: parseJSONField(course.prerequisites) || [],
  objectives: parseJSONField(course.objectives) || [],
  level: course.level || 'beginner',
  language: course.language || 'English',
});

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

// GET /api/v1/courses
const getAllCourses = async (req, res) => {
  try {
    let query = `SELECT c.*, u.full_name as teacher_name
                 FROM courses c
                 LEFT JOIN users u ON c.teacher_id = u.id`;
    const queryParams = [];

    if (req.user.roles?.includes('admin')) {
      query += ' ORDER BY c.created_at DESC';
    } else if (req.user.roles?.includes('teacher')) {
      query += ' WHERE c.teacher_id = ? ORDER BY c.created_at DESC';
      queryParams.push(req.user.id);
    } else {
      query += ' WHERE c.status = ? ORDER BY c.created_at DESC';
      queryParams.push('published');
    }

    const [courses] = await pool.query(query, queryParams);
    return res.status(200).json({ success: true, message: 'Courses fetched', data: courses.map(normalizeCourseRow) });
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
      data: { ...normalizeCourseRow(courses[0]), lessons },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/v1/courses (teacher/admin)
const createCourse = async (req, res) => {
  const {
    title,
    description,
    category,
    status,
    imageUrl,
    level,
    language,
    tags,
    prerequisites,
    objectives,
    materials,
    sections,
  } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO courses (
        title,
        description,
        category,
        teacher_id,
        status,
        image_url,
        level,
        language,
        tags,
        prerequisites,
        objectives,
        materials,
        sections
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        category,
        req.user.id,
        status || 'draft',
        imageUrl || null,
        level || 'beginner',
        language || 'English',
        JSON.stringify(tags || []),
        JSON.stringify(prerequisites || []),
        JSON.stringify(objectives || []),
        JSON.stringify(materials || []),
        JSON.stringify(sections || []),
      ]
    );

    await notifyAdmins(
      'New course submitted for review',
      `${title} was submitted by ${req.user.full_name || 'a teacher'} for admin verification.`,
      'content_review'
    );

    return res.status(201).json({ success: true, message: 'Course created', data: { id: result.insertId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/v1/courses/:id (teacher/admin)
const updateCourse = async (req, res) => {
  const {
    title,
    description,
    category,
    status,
    imageUrl,
    level,
    language,
    tags,
    prerequisites,
    objectives,
    materials,
    sections,
  } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ success: false, message: 'Course not found' });

    const currentCourse = existing[0];
    const newStatus = status || currentCourse.status;
    const newTitle = title ?? currentCourse.title;
    const newDescription = description ?? currentCourse.description;
    const newCategory = category ?? currentCourse.category ?? 'General';
    const newImageUrl = imageUrl ?? currentCourse.image_url ?? null;
    const newLevel = level ?? currentCourse.level ?? 'beginner';
    const newLanguage = language ?? currentCourse.language ?? 'English';
    const newTags = tags != null ? JSON.stringify(tags) : JSON.stringify(parseJSONField(currentCourse.tags) || []);
    const newPrerequisites = prerequisites != null ? JSON.stringify(prerequisites) : JSON.stringify(parseJSONField(currentCourse.prerequisites) || []);
    const newObjectives = objectives != null ? JSON.stringify(objectives) : JSON.stringify(parseJSONField(currentCourse.objectives) || []);
    const newMaterials = materials != null ? JSON.stringify(materials) : JSON.stringify(parseJSONField(currentCourse.materials) || []);
    const newSections = sections != null ? JSON.stringify(sections) : JSON.stringify(parseJSONField(currentCourse.sections) || []);

    await pool.query(
      `UPDATE courses SET
        title = ?,
        description = ?,
        category = ?,
        status = ?,
        image_url = ?,
        level = ?,
        language = ?,
        tags = ?,
        prerequisites = ?,
        objectives = ?,
        materials = ?,
        sections = ?
      WHERE id = ?`,
      [
        newTitle,
        newDescription,
        newCategory,
        newStatus,
        newImageUrl,
        newLevel,
        newLanguage,
        newTags,
        newPrerequisites,
        newObjectives,
        newMaterials,
        newSections,
        req.params.id,
      ]
    );

    if (newStatus === 'submitted') {
      await notifyAdmins(
        'Course resubmitted for review',
        `${newTitle} was updated and resubmitted for admin verification.`,
        'content_review'
      );
    }

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
