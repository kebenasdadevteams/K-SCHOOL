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

// File upload for editor (images)
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_')); }
});
const upload = multer({ storage });

// FIXED: Upload route with proper URL construction
// In your editor-routes.js, update the upload route
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No file uploaded' 
    });
  }
  
  // Get the base URL from environment or use default
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  // Remove trailing slash if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  // Construct the full URL
  const url = `${cleanBaseUrl}/uploads/${req.file.filename}`;
  
  return res.json({ 
    success: true, 
    data: { 
      url, 
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    } 
  });
});

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

// Devotionals (Editor only)
const {
  getDevotionals, getDevotionalById, createDevotional, updateDevotional, deleteDevotional, publishNow, scheduleDevotional
} = require('../controllers/devotional-controller');

router.get('/devotionals', getDevotionals);
router.get('/devotionals/:id', getDevotionalById);
router.post('/devotionals', createDevotional);
router.put('/devotionals/:id', updateDevotional);
router.delete('/devotionals/:id', deleteDevotional);
router.post('/devotionals/:id/publish', publishNow);
router.post('/devotionals/:id/schedule', scheduleDevotional);

module.exports = router;