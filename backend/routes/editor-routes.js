const express = require('express');
const {
  getEvents, createEvent, updateEvent, deleteEvent,
  getPrograms, createProgram, updateProgram, deleteProgram,
  getQuotes, createQuote, deleteQuote,
  getSettings, updateSettings,
} = require('../controllers/editor-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const router = express.Router();
router.use(authenticate);
router.use(requireRole('editor', 'admin'));

router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

router.get('/programs', getPrograms);
router.post('/programs', createProgram);
router.put('/programs/:id', updateProgram);
router.delete('/programs/:id', deleteProgram);

router.get('/quotes', getQuotes);
router.post('/quotes', createQuote);
router.delete('/quotes/:id', deleteQuote);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
