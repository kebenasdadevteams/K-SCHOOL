// backend/routes/activity-routes.js
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
  uploadReadingMaterial,
  getReadingMaterials,
  getReadingMaterialById,
  updateReadingMaterial,
  deleteReadingMaterial
} = require('../controllers/activity-controller');
const { authenticate } = require('../middleware/auth-middleware');
const { requireRole } = require('../middleware/role-middleware');
const upload = require('../middleware/upload');
const { pool } = require('../config/db'); // Add this
const { v4: uuidv4 } = require('uuid'); // Add this
const path = require('path'); // Add this

const router = express.Router();

// Existing routes
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

// Reading Materials Routes
router.post(
  '/upload-reading-material',
  authenticate,
  requireRole('teacher', 'pastor', 'admin', 'developer'),
  upload.single('file'),
  uploadReadingMaterial
);

router.get(
  '/reading-materials/:courseId',
  authenticate,
  getReadingMaterials
);

router.get(
  '/reading-materials/:courseId/:materialId',
  authenticate,
  getReadingMaterialById
);

router.put(
  '/reading-materials/:materialId',
  authenticate,
  requireRole('teacher', 'pastor', 'admin', 'developer'),
  updateReadingMaterial
);

router.delete(
  '/reading-materials/:materialId',
  authenticate,
  requireRole('teacher', 'pastor', 'admin', 'developer'),
  deleteReadingMaterial
);

// Bulk upload endpoint
router.post(
  '/upload-reading-materials/bulk',
  authenticate,
  requireRole('teacher', 'pastor', 'admin', 'developer'),
  upload.array('files', 10),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { courseId, chapterId, description } = req.body;
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      if (!courseId) {
        return res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
      }

      const uploadedFiles = [];
      for (const file of files) {
        const materialId = uuidv4();
        const materialData = {
          id: materialId,
          fileName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          title: file.originalname,
          description: description || '',
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId,
          courseId: courseId,
          chapterId: chapterId || null,
          fileUrl: `/uploads/reading-materials/${path.basename(file.path)}`
        };

        // Save to database
        await pool.query(
          `INSERT INTO reading_materials 
           (id, course_id, chapter_id, file_name, file_path, file_size, mime_type, title, description, uploaded_by, uploaded_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            materialData.id,
            materialData.courseId,
            materialData.chapterId,
            materialData.fileName,
            materialData.filePath,
            materialData.fileSize,
            materialData.mimeType,
            materialData.title,
            materialData.description,
            materialData.uploadedBy,
            materialData.uploadedAt
          ]
        );

        uploadedFiles.push(materialData);
      }

      res.json({
        success: true,
        data: uploadedFiles,
        message: `${uploadedFiles.length} material(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload materials'
      });
    }
  }
);

module.exports = router;