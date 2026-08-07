// backend/routes/promotion-routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');

const {
  getPromotions,
  getPromotionBySlug,
  getHomepagePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  publishPromotion,
  schedulePromotion,
  getPromotionStats
} = require('../controllers/promotion-controller');

// Setup upload directories
const uploadDir = path.join(__dirname, '..', 'uploads', 'promotions');
const imagesDir = path.join(uploadDir, 'images');
const videosDir = path.join(uploadDir, 'videos');

[uploadDir, imagesDir, videosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.startsWith('video/') ? 'videos' : 'images';
    cb(null, path.join(uploadDir, type));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  },
  fileFilter: function (req, file, cb) {
    const allowedImages = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
    const allowedVideos = ['video/mp4', 'video/quicktime', 'video/webm', 'video/mov'];
    
    if (allowedImages.includes(file.mimetype) || allowedVideos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// ==================== UPLOAD ROUTE ====================
// Allow admin, editor, AND pastor to upload
router.post('/upload', authenticate, requireRole('admin', 'editor', 'pastor'), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const subFolder = req.file.destination.split('promotions' + path.sep)[1] || 'images';
    const filePath = `/uploads/promotions/${subFolder}/${req.file.filename}`;
    const url = `${baseUrl}${filePath}`;

    res.json({
      success: true,
      data: {
        url,
        filePath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// ==================== PUBLIC ROUTES ====================
// (No authentication required)
router.get('/homepage', getHomepagePromotions);

// ==================== PROTECTED ROUTES ====================
// (Authentication required - Admin, Editor, AND Pastor)
// IMPORTANT: Changed to include 'pastor'
router.use(authenticate);
router.use(requireRole('admin', 'pastor'));

// Specific routes MUST come before dynamic routes
router.get('/stats', getPromotionStats);
router.get('/', getPromotions);
router.post('/', createPromotion);

// Dynamic routes (with parameters) - MUST come last
router.get('/:slug', getPromotionBySlug);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);
router.post('/:id/publish', publishPromotion);
router.post('/:id/schedule', schedulePromotion);

module.exports = router;