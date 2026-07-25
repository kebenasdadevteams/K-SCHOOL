const express = require('express');
const {
  getTeacherStats,
  getTeacherStudents,
  getTeacherAssignments,
  getTeacherSubmissions,
} = require('../controllers/teacher-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const router = express.Router();

router.use(authenticate, requireRole('teacher', 'admin'));

router.get('/stats', getTeacherStats);
router.get('/students', getTeacherStudents);
router.get('/assignments', getTeacherAssignments);
router.get('/submissions', getTeacherSubmissions);

module.exports = router;
