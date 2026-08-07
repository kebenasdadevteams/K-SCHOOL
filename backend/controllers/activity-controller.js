const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

/**
 * Enroll a student in a course
 * POST /api/v1/activity/enroll
 */
const enrollCourse = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if course exists
    const [course] = await pool.query(
      'SELECT id, title, teacher_id FROM courses WHERE id = ?',
      [courseId]
    );

    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const [existing] = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollmentId = uuidv4();
    await pool.query(
      `INSERT INTO enrollments (id, user_id, course_id, enrolled_at, status) 
       VALUES (?, ?, ?, NOW(), 'active')`,
      [enrollmentId, userId, courseId]
    );

    // Create notification for teacher
    await pool.query(
      `INSERT INTO notifications (user_id, title, message) 
       VALUES (?, ?, ?)`,
      [
        course[0].teacher_id,
        'New student enrolled',
        `${req.user?.full_name || 'A student'} has enrolled in your course: ${course[0].title}`
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        enrollmentId,
        courseId,
        courseTitle: course[0].title
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

/**
 * Get user's enrollments
 * GET /api/v1/activity/enrollments
 */
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const [enrollments] = await pool.query(
      `SELECT e.*, c.title as course_title, c.description, c.image_url as thumbnail, c.category, c.level,
              u.full_name as teacher_name,
              (SELECT COUNT(*) FROM assignments a WHERE a.course_id = c.id) as total_assignments,
              (SELECT COUNT(*) FROM submissions s WHERE s.student_id = ? AND s.assignment_id IN (SELECT id FROM assignments WHERE course_id = c.id)) as submitted_assignments,
              (SELECT COUNT(*) FROM submissions s WHERE s.student_id = ? AND s.assignment_id IN (SELECT id FROM assignments WHERE course_id = c.id) AND s.grade IS NOT NULL) as graded_assignments
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       LEFT JOIN users u ON c.teacher_id = u.id
       WHERE e.user_id = ? AND e.status = 'active'
       ORDER BY e.enrolled_at DESC`,
      [userId, userId, userId]
    );

    return res.status(200).json({
      success: true,
      data: enrollments,
      message: 'Enrollments retrieved successfully'
    });

  } catch (error) {
    console.error('Get enrollments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve enrollments'
    });
  }
};

/**
 * Get user's assignments
 * GET /api/v1/activity/assignments
 */
const getMyAssignments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId, status } = req.query;

    let query = `
      SELECT a.*, c.title as course_title, 
             (SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = a.id AND user_id = ?) as has_submitted
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN enrollments e ON e.course_id = c.id
      WHERE e.user_id = ? AND a.due_date >= NOW()
    `;
    const params = [userId, userId];

    if (courseId) {
      query += ' AND a.course_id = ?';
      params.push(courseId);
    }

    if (status === 'submitted') {
      query += ' AND EXISTS (SELECT 1 FROM assignment_submissions WHERE assignment_id = a.id AND user_id = ?)';
      params.push(userId);
    } else if (status === 'pending') {
      query += ' AND NOT EXISTS (SELECT 1 FROM assignment_submissions WHERE assignment_id = a.id AND user_id = ?)';
      params.push(userId);
    }

    query += ' ORDER BY a.due_date ASC';

    const [assignments] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: assignments,
      message: 'Assignments retrieved successfully'
    });

  } catch (error) {
    console.error('Get assignments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assignments'
    });
  }
};

/**
 * Submit an assignment
 * POST /api/v1/activity/assignments/submit
 */
const submitAssignment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { assignmentId, content, fileUrl } = req.body;

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID is required'
      });
    }

    // Check if assignment exists
    const [assignment] = await pool.query(
      'SELECT * FROM assignments WHERE id = ?',
      [assignmentId]
    );

    if (assignment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if already submitted
    const [existing] = await pool.query(
      'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND user_id = ?',
      [assignmentId, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already submitted this assignment'
      });
    }

    // Create submission
    const submissionId = uuidv4();
    await pool.query(
      `INSERT INTO assignment_submissions 
       (id, assignment_id, user_id, content, file_url, submitted_at, status)
       VALUES (?, ?, ?, ?, ?, NOW(), 'pending')`,
      [submissionId, assignmentId, userId, content || '', fileUrl || null]
    );

    // Get course teacher for notification
    const [course] = await pool.query(
      'SELECT teacher_id FROM courses WHERE id = (SELECT course_id FROM assignments WHERE id = ?)',
      [assignmentId]
    );

    if (course.length > 0) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, ?, ?, ?)`,
        [
          course[0].teacher_id,
          'Assignment submitted',
          `${req.user?.full_name || 'A student'} has submitted an assignment`,
          'assignment'
        ]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: {
        submissionId,
        assignmentId
      }
    });

  } catch (error) {
    console.error('Submit assignment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit assignment'
    });
  }
};

/**
 * Get student progress
 * GET /api/v1/activity/progress
 */
const getStudentProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let query = `
      SELECT c.id as course_id, c.title as course_title,
             COUNT(DISTINCT l.id) as total_lessons,
             COUNT(DISTINCT a.id) as total_assignments,
             COUNT(DISTINCT s.id) as submitted_assignments,
             ROUND(
               CASE WHEN COUNT(DISTINCT a.id) = 0 THEN 0
                    ELSE COUNT(DISTINCT s.id) / COUNT(DISTINCT a.id) * 100
               END, 2
             ) as progress_percentage
      FROM courses c
      JOIN enrollments e ON e.course_id = c.id
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN assignments a ON a.course_id = c.id AND a.due_date >= NOW()
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
      WHERE e.user_id = ? AND e.status = 'active'
    `;
    const params = [userId, userId];

    if (courseId) {
      query += ' AND c.id = ?';
      params.push(courseId);
    }

    query += ' GROUP BY c.id, c.title';

    const [progress] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: progress,
      message: 'Progress retrieved successfully'
    });

  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve progress'
    });
  }
};

/**
 * Get student progress for teacher
 * GET /api/v1/activity/progress/:studentId
 */
const getStudentProgressByTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user?.id;

    const [access] = await pool.query(
      `SELECT e.course_id 
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ? AND c.teacher_id = ?`,
      [studentId, teacherId]
    );

    if (access.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this student\'s progress'
      });
    }

    const [progress] = await pool.query(
      `SELECT c.id as course_id, c.title as course_title,
              COUNT(DISTINCT l.id) as total_lessons,
              COUNT(DISTINCT a.id) as total_assignments,
              COUNT(DISTINCT s.id) as submitted_assignments,
              ROUND(
                CASE WHEN COUNT(DISTINCT a.id) = 0 THEN 0
                     ELSE COUNT(DISTINCT s.id) / COUNT(DISTINCT a.id) * 100
                END, 2
              ) as progress_percentage
       FROM courses c
       JOIN enrollments e ON e.course_id = c.id
       LEFT JOIN lessons l ON l.course_id = c.id
       LEFT JOIN assignments a ON a.course_id = c.id AND a.due_date >= NOW()
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ?
       WHERE e.user_id = ? AND e.status = 'active'
       GROUP BY c.id, c.title`,
      [studentId, studentId]
    );

    return res.status(200).json({
      success: true,
      data: progress,
      message: 'Student progress retrieved successfully'
    });

  } catch (error) {
    console.error('Get student progress error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student progress'
    });
  }
};

/**
 * Send a message
 * POST /api/v1/activity/messages
 */
const sendMessage = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { recipientId, subject, content, courseId } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and content are required'
      });
    }

    const messageId = uuidv4();
    await pool.query(
      `INSERT INTO messages (id, sender_id, recipient_id, subject, content, course_id, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [messageId, userId, recipientId, subject || '', content, courseId || null]
    );

    // Create notification for recipient
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES (?, ?, ?, ?)`,
      [
        recipientId,
        'New message',
        `You have a new message from ${req.user?.full_name || 'a user'}`,
        'message'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

/**
 * Get user's messages
 * GET /api/v1/activity/messages
 */
const getMyMessages = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { unreadOnly } = req.query;

    let query = `
      SELECT m.*, 
             u_sender.full_name as sender_name,
             u_recipient.full_name as recipient_name,
             c.title as course_title
      FROM messages m
      LEFT JOIN users u_sender ON u_sender.id = m.sender_id
      LEFT JOIN users u_recipient ON u_recipient.id = m.recipient_id
      LEFT JOIN courses c ON c.id = m.course_id
      WHERE m.sender_id = ? OR m.recipient_id = ?
    `;
    const params = [userId, userId];

    if (unreadOnly === 'true') {
      query += ' AND m.read_at IS NULL AND m.recipient_id = ?';
      params.push(userId);
    }

    query += ' ORDER BY m.sent_at DESC';

    const [messages] = await pool.query(query, params);

    // Mark messages as read if they're for the current user
    if (unreadOnly !== 'true') {
      await pool.query(
        'UPDATE messages SET read_at = NOW() WHERE recipient_id = ? AND read_at IS NULL',
        [userId]
      );
    }

    return res.status(200).json({
      success: true,
      data: messages,
      message: 'Messages retrieved successfully'
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
};

/**
 * Get user's notifications
 * GET /api/v1/activity/notifications
 */
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { limit = 50, offset = 0, unreadOnly } = req.query;

    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `;
    const params = [userId];

    if (unreadOnly === 'true') {
      query += ' AND read_at IS NULL';
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [notifications] = await pool.query(query, params);

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      message: 'Notifications retrieved successfully'
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications'
    });
  }
};

/**
 * Mark notifications as read
 * PUT /api/v1/activity/notifications/read
 */
const markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { notificationIds } = req.body;

    if (notificationIds && notificationIds.length > 0) {
      const placeholders = notificationIds.map(() => '?').join(',');
      await pool.query(
        `UPDATE notifications SET read_at = NOW() 
         WHERE user_id = ? AND id IN (${placeholders})`,
        [userId, ...notificationIds]
      );
    } else {
      // Mark all as read
      await pool.query(
        'UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL',
        [userId]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Notifications marked as read'
    });

  } catch (error) {
    console.error('Mark notifications read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
};

/**
 * Upload reading material
 * POST /api/v1/activity/upload-reading-material
 */
const uploadReadingMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user?.id;
    const { courseId, chapterId, title, description } = req.body;

    // Validate required fields
    if (!courseId) {
      // Clean up uploaded file if validation fails
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if user has permission to upload to this course
    const [courseCheck] = await pool.query(
      'SELECT teacher_id FROM courses WHERE id = ?',
      [courseId]
    );

    if (courseCheck.length === 0) {
      // Clean up file
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the teacher or has admin/developer role
    const isAuthorized = 
      courseCheck[0].teacher_id === userId || 
      req.user?.roles?.includes('admin') || 
      req.user?.roles?.includes('developer') ||
      req.user?.roles?.includes('pastor');

    if (!isAuthorized) {
      // Clean up file
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to upload materials to this course'
      });
    }

    // Create material data
    const materialId = uuidv4();
    const materialData = {
      id: materialId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      title: title || req.file.originalname,
      description: description || '',
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId,
      courseId: courseId,
      chapterId: chapterId || null,
      fileUrl: `/uploads/reading-materials/${path.basename(req.file.path)}`
    };

    // Save to database - create reading_materials table if not exists
    try {
      // First, create the table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reading_materials (
          id VARCHAR(36) PRIMARY KEY,
          course_id INT NOT NULL,
          chapter_id INT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          uploaded_by INT NOT NULL,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
          FOREIGN KEY (uploaded_by) REFERENCES users(id)
        )
      `);

      // Insert the material
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

      // Create notification for the course teacher if different from uploader
      if (courseCheck[0].teacher_id !== userId) {
        await pool.query(
          `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
          [
            courseCheck[0].teacher_id,
            'New reading material uploaded',
            `${req.user?.full_name || 'A teacher'} uploaded reading material: ${materialData.title}`,
            'material'
          ]
        );
      }

    } catch (dbError) {
      console.error('Database error saving reading material:', dbError);
      // Clean up file if database insert fails
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      throw dbError;
    }

    return res.status(201).json({
      success: true,
      data: materialData,
      message: 'Reading material uploaded successfully'
    });

  } catch (error) {
    console.error('Upload reading material error:', error);
    // Clean up uploaded file if there's an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to upload reading material',
      error: error.message
    });
  }
};

/**
 * Get reading materials for a course
 * GET /api/v1/activity/reading-materials/:courseId
 */
const getReadingMaterials = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { courseId } = req.params;
    const { chapterId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if user has access to this course
    const [enrollment] = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = "active"',
      [userId, courseId]
    );

    // Check if user is teacher or admin
    const [course] = await pool.query(
      'SELECT teacher_id FROM courses WHERE id = ?',
      [courseId]
    );

    const isTeacher = course.length > 0 && course[0].teacher_id === userId;
    const isAdmin = req.user?.roles?.includes('admin') || req.user?.roles?.includes('developer');

    if (!isTeacher && !isAdmin && enrollment.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this course'
      });
    }

    let query = `
      SELECT rm.*, u.full_name as uploaded_by_name
      FROM reading_materials rm
      LEFT JOIN users u ON u.id = rm.uploaded_by
      WHERE rm.course_id = ?
    `;
    const params = [courseId];

    if (chapterId) {
      query += ' AND rm.chapter_id = ?';
      params.push(chapterId);
    }

    query += ' ORDER BY rm.uploaded_at DESC';

    const [rows] = await pool.query(query, params);

    // Transform file paths to full URLs
    const materials = rows.map(row => ({
      ...row,
      fileUrl: row.file_path ? `/uploads/reading-materials/${path.basename(row.file_path)}` : null
    }));

    return res.status(200).json({
      success: true,
      data: materials,
      message: 'Reading materials retrieved successfully'
    });

  } catch (error) {
    console.error('Get reading materials error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reading materials'
    });
  }
};

/**
 * Get specific reading material by ID
 * GET /api/v1/activity/reading-materials/:courseId/:materialId
 */
const getReadingMaterialById = async (req, res) => {
  try {
    const { courseId, materialId } = req.params;
    const userId = req.user?.id;

    const [rows] = await pool.query(
      `SELECT rm.*, u.full_name as uploaded_by_name
       FROM reading_materials rm
       LEFT JOIN users u ON u.id = rm.uploaded_by
       WHERE rm.id = ? AND rm.course_id = ?`,
      [materialId, courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reading material not found'
      });
    }

    // Check if user has access to this material
    // Students can see materials for courses they're enrolled in
    const [enrollment] = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = "active"',
      [userId, courseId]
    );

    const isTeacher = rows[0].uploaded_by === userId;
    const isAdmin = req.user?.roles?.includes('admin') || req.user?.roles?.includes('developer');
    const isEnrolled = enrollment.length > 0;

    if (!isTeacher && !isAdmin && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this material'
      });
    }

    const material = {
      ...rows[0],
      fileUrl: rows[0].file_path ? `/uploads/reading-materials/${path.basename(rows[0].file_path)}` : null
    };

    return res.status(200).json({
      success: true,
      data: material,
      message: 'Reading material retrieved successfully'
    });

  } catch (error) {
    console.error('Get reading material error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reading material'
    });
  }
};

/**
 * Update reading material metadata
 * PUT /api/v1/activity/reading-materials/:materialId
 */
const updateReadingMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.id;

    // Check if material exists and user has permission
    const [material] = await pool.query(
      'SELECT * FROM reading_materials WHERE id = ?',
      [materialId]
    );

    if (material.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reading material not found'
      });
    }

    const isAuthorized = 
      material[0].uploaded_by === userId ||
      req.user?.roles?.includes('admin') ||
      req.user?.roles?.includes('developer');

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this material'
      });
    }

    await pool.query(
      'UPDATE reading_materials SET title = ?, description = ? WHERE id = ?',
      [title || material[0].title, description || material[0].description, materialId]
    );

    return res.status(200).json({
      success: true,
      message: 'Reading material updated successfully',
      data: { id: materialId, title, description }
    });

  } catch (error) {
    console.error('Update reading material error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update reading material'
    });
  }
};

/**
 * Delete reading material
 * DELETE /api/v1/activity/reading-materials/:materialId
 */
const deleteReadingMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user?.id;

    // Check if material exists and user has permission
    const [material] = await pool.query(
      'SELECT * FROM reading_materials WHERE id = ?',
      [materialId]
    );

    if (material.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reading material not found'
      });
    }

    const isAuthorized = 
      material[0].uploaded_by === userId ||
      req.user?.roles?.includes('admin') ||
      req.user?.roles?.includes('developer');

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this material'
      });
    }

    // Delete the file from filesystem
    if (material[0].file_path) {
      try {
        if (fs.existsSync(material[0].file_path)) {
          fs.unlinkSync(material[0].file_path);
        }
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Delete from database
    await pool.query('DELETE FROM reading_materials WHERE id = ?', [materialId]);

    return res.status(200).json({
      success: true,
      message: 'Reading material deleted successfully'
    });

  } catch (error) {
    console.error('Delete reading material error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete reading material'
    });
  }
};

// Export all functions
module.exports = {
  enrollCourse,
  getMyEnrollments,
  getMyAssignments,
  submitAssignment,
  getStudentProgress,
  getStudentProgressByTeacher,
  sendMessage,
  getMyMessages,
  getMyNotifications,
  markNotificationsRead,
  uploadReadingMaterial,
  getReadingMaterials,
  getReadingMaterialById,
  updateReadingMaterial,
  deleteReadingMaterial
};