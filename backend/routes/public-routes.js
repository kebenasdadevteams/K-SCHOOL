const express = require('express');
const { getEvents, getPrograms, getQuotes, getPublicPosts, getPublicPodcasts, getSettings } = require('../controllers/public-controller');
const router = express.Router();

router.get('/events', getEvents);
router.get('/programs', getPrograms);
router.get('/quotes', getQuotes);
router.get('/posts', getPublicPosts);
router.get('/podcasts', getPublicPodcasts);
router.get('/settings', getSettings);

module.exports = router;
