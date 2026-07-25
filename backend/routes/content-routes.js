const express = require('express');
const {
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
} = require('../controllers/content-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const router = express.Router();

// Posts
router.get('/posts', authenticate, getAllPosts);
router.post('/posts', authenticate, requireRole('editor', 'admin'), createPost);
router.put('/posts/:id', authenticate, requireRole('editor', 'admin'), updatePost);
router.delete('/posts/:id', authenticate, requireRole('editor', 'admin'), deletePost);

// Podcasts
router.get('/podcasts', authenticate, getAllPodcasts);
router.post('/podcasts', authenticate, requireRole('editor', 'admin'), createPodcast);

// Admin review workflow
router.get('/all', authenticate, requireRole('admin', 'editor', 'teacher', 'pastor', 'developer'), getAllContent);
router.get('/review-queue', authenticate, requireRole('admin', 'editor', 'teacher', 'pastor', 'developer'), getReviewQueue);
router.get('/type/:type/:id', authenticate, requireRole('admin', 'editor', 'teacher', 'pastor', 'developer'), getContentById);
router.put('/type/:type/:id', authenticate, requireRole('admin', 'editor', 'teacher', 'pastor', 'developer'), updateContentByType);
router.post('/type/:type/:id/review', authenticate, requireRole('admin'), reviewContent);
router.delete('/type/:type/:id', authenticate, requireRole('admin', 'editor', 'teacher', 'pastor', 'developer'), deleteContentByType);

module.exports = router;
