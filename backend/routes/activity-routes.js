const express = require('express');
const {
  enrollCourse,
  getMyEnrollments,
  sendMessage,
  getMyMessages,
  getMyNotifications,
  markNotificationsRead,
} = require('../controllers/activity-controller');
const { authenticate } = require('../middleware/auth-middleware');

const router = express.Router();

router.post('/enroll', authenticate, enrollCourse);
router.get('/enrollments', authenticate, getMyEnrollments);
router.post('/messages', authenticate, sendMessage);
router.get('/messages', authenticate, getMyMessages);
router.get('/notifications', authenticate, getMyNotifications);
router.put('/notifications/read', authenticate, markNotificationsRead);

module.exports = router;
