const express = require('express');
const {
  enrollCourse,
  getMyEnrollments,
  getMyAssignments,
  submitAssignment,
  getStudentProgress,
  sendMessage,
  getMyMessages,
  getMyNotifications,
  markNotificationsRead,
} = require('../controllers/activity-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const router = express.Router();

router.post('/enroll', authenticate, enrollCourse);
router.get('/enrollments', authenticate, getMyEnrollments);
router.get('/assignments', authenticate, getMyAssignments);
router.post('/assignments/submit', authenticate, submitAssignment);
router.get('/progress', authenticate, getStudentProgress);
router.get('/progress/:studentId', authenticate, requireRole('teacher', 'pastor', 'admin', 'developer'), getStudentProgress);
router.post('/messages', authenticate, sendMessage);
router.get('/messages', authenticate, getMyMessages);
router.get('/notifications', authenticate, getMyNotifications);
router.put('/notifications/read', authenticate, markNotificationsRead);

module.exports = router;
