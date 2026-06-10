const express = require('express');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/course-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const router = express.Router();

router.get('/', authenticate, getAllCourses);
router.get('/:id', authenticate, getCourseById);
router.post('/', authenticate, requireRole('teacher', 'admin'), createCourse);
router.put('/:id', authenticate, requireRole('teacher', 'admin'), updateCourse);
router.delete('/:id', authenticate, requireRole('teacher', 'admin'), deleteCourse);

module.exports = router;
