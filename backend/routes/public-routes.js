const express = require('express');
const router = express.Router();

// Import controllers - make sure all these exist in public-controller.js
const { 
  getEvents, 
  getPrograms, 
  getQuotes, 
  getPublicPosts, 
  getPublicPodcasts, 
  getSettings,
  getPublicDevotionals,
  getTodayDevotional,
  getDevotionalBySlug
} = require('../controllers/public-controller');

// Public routes - no authentication required
router.get('/events', getEvents);
router.get('/programs', getPrograms);
router.get('/quotes', getQuotes);
router.get('/posts', getPublicPosts);
router.get('/podcasts', getPublicPodcasts);
router.get('/settings', getSettings);
router.get('/devotionals', getPublicDevotionals);
router.get('/devotionals/today', getTodayDevotional);
router.get('/devotionals/:slug', getDevotionalBySlug);

module.exports = router;