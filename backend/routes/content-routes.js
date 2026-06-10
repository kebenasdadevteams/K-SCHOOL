const express = require('express');
const {
  getAllPosts, createPost, updatePost, deletePost,
  getAllPodcasts, createPodcast
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

module.exports = router;
