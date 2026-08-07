// backend/controllers/promotion-controller.js
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper: Generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() + '-' + Date.now();
};

// Helper: Get full image URL
const getFullUrl = (pathStr) => {
  if (!pathStr) return null;
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const cleanPath = pathStr.startsWith('/') ? pathStr : '/' + pathStr;
  return `${baseUrl}${cleanPath}`;
};

// ==================== GET ALL PROMOTIONS ====================
exports.getPromotions = async (req, res) => {
  try {
    const { status, category, type, mediaType, search, sort = 'created_at DESC' } = req.query;
    
    let query = `
      SELECT p.*, u1.full_name as created_by_name, u2.full_name as updated_by_name
      FROM promotions p
      LEFT JOIN users u1 ON p.created_by = u1.id
      LEFT JOIN users u2 ON p.updated_by = u2.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    if (category && category !== 'all') {
      query += ` AND p.category = ?`;
      params.push(category);
    }
    if (type && type !== 'all') {
      query += ` AND p.promotion_type = ?`;
      params.push(type);
    }
    if (mediaType && mediaType !== 'all') {
      query += ` AND p.media_type = ?`;
      params.push(mediaType);
    }
    if (search) {
      query += ` AND (p.title LIKE ? OR p.header LIKE ? OR p.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY p.${sort}`;

    const [rows] = await pool.query(query, params);
    
    const formatted = rows.map(row => ({
      ...row,
      image_url: getFullUrl(row.image_url),
      video_url: getFullUrl(row.video_url),
      thumbnail_url: getFullUrl(row.thumbnail_url),
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch promotions', 
      error: error.message 
    });
  }
};

// ==================== GET PROMOTION STATS ====================
exports.getPromotionStats = async (req, res) => {
  try {
    // Check if table exists first
    const [tables] = await pool.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'promotions'"
    );
    
    if (tables.length === 0) {
      return res.json({ 
        success: true, 
        data: {
          total: 0,
          published: 0,
          scheduled: 0,
          drafts: 0,
          expired: 0,
          archived: 0,
          videos: 0,
          images: 0
        }
      });
    }

    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
        SUM(CASE WHEN media_type = 'video' THEN 1 ELSE 0 END) as videos,
        SUM(CASE WHEN media_type = 'image' THEN 1 ELSE 0 END) as images
      FROM promotions`
    );

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats instead of error
    res.json({ 
      success: true, 
      data: {
        total: 0,
        published: 0,
        scheduled: 0,
        drafts: 0,
        expired: 0,
        archived: 0,
        videos: 0,
        images: 0
      }
    });
  }
};

// ==================== GET HOMEPAGE PROMOTIONS ====================
exports.getHomepagePromotions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, u1.full_name as created_by_name 
       FROM promotions p
       LEFT JOIN users u1 ON p.created_by = u1.id
       WHERE p.status = 'published' 
       AND p.show_on_homepage = 1
       ORDER BY p.is_featured DESC, p.published_at DESC
       LIMIT 20`
    );

    const formatted = rows.map(row => ({
      ...row,
      image_url: getFullUrl(row.image_url),
      video_url: getFullUrl(row.video_url),
      thumbnail_url: getFullUrl(row.thumbnail_url),
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching homepage promotions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch promotions',
      error: error.message 
    });
  }
};

// ==================== GET PROMOTION BY SLUG ====================
exports.getPromotionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Skip if slug is 'stats' or 'homepage' (shouldn't happen due to route order, but just in case)
    if (slug === 'stats' || slug === 'homepage') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    
    const [rows] = await pool.query(
      `SELECT p.*, u1.full_name as created_by_name 
       FROM promotions p
       LEFT JOIN users u1 ON p.created_by = u1.id
       WHERE p.slug = ? AND p.status = 'published'`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    const formatted = {
      ...rows[0],
      image_url: getFullUrl(rows[0].image_url),
      video_url: getFullUrl(rows[0].video_url),
      thumbnail_url: getFullUrl(rows[0].thumbnail_url),
    };

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching promotion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch promotion',
      error: error.message 
    });
  }
};

// ==================== CREATE PROMOTION ====================
exports.createPromotion = async (req, res) => {
  try {
    const {
      title, 
      header, 
      description, 
      content, 
      category, 
      promotion_type,
      media_type, 
      image_url, 
      video_url, 
      thumbnail_url,
      location, 
      address, 
      speaker, 
      organizer,
      event_date, 
      start_time, 
      end_time,
      status, 
      is_featured, 
      show_on_homepage,
      allow_download, 
      allow_share, 
      publish_at
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title is required' 
      });
    }

    // Generate slug
    const slug = generateSlug(title);
    const userId = req.user?.id || 1;

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO promotions (
        title, header, description, content, slug, category, promotion_type,
        media_type, image_url, video_url, thumbnail_url,
        location, address, speaker, organizer,
        event_date, start_time, end_time,
        status, is_featured, show_on_homepage,
        allow_download, allow_share, publish_at,
        created_by, updated_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title, 
        header || null, 
        description || null, 
        content || null, 
        slug, 
        category || 'General', 
        promotion_type || 'Event',
        media_type || 'image', 
        image_url || null, 
        video_url || null, 
        thumbnail_url || null,
        location || null, 
        address || null, 
        speaker || null, 
        organizer || null,
        event_date || null, 
        start_time || null, 
        end_time || null,
        status || 'draft', 
        is_featured || 0, 
        show_on_homepage !== undefined ? show_on_homepage : 1,
        allow_download || 0, 
        allow_share || 1, 
        publish_at || null,
        userId, 
        userId
      ]
    );

    // Get the newly created promotion
    const [newPromotion] = await pool.query(
      `SELECT p.*, u1.full_name as created_by_name 
       FROM promotions p
       LEFT JOIN users u1 ON p.created_by = u1.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    const formatted = {
      ...newPromotion[0],
      image_url: getFullUrl(newPromotion[0].image_url),
      video_url: getFullUrl(newPromotion[0].video_url),
      thumbnail_url: getFullUrl(newPromotion[0].thumbnail_url),
    };

    res.status(201).json({ 
      success: true, 
      data: formatted,
      message: 'Promotion created successfully' 
    });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create promotion', 
      error: error.message 
    });
  }
};

// ==================== UPDATE PROMOTION ====================
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id || 1;

    // Check if promotion exists
    const [existing] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Promotion not found' 
      });
    }

    // Build update query
    const fields = [];
    const values = [];

    const allowedFields = [
      'title', 'header', 'description', 'content', 'category', 'promotion_type',
      'media_type', 'image_url', 'video_url', 'thumbnail_url',
      'location', 'address', 'speaker', 'organizer',
      'event_date', 'start_time', 'end_time',
      'status', 'is_featured', 'show_on_homepage',
      'allow_download', 'allow_share', 'publish_at'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    fields.push('updated_by = ?');
    values.push(userId);
    fields.push('updated_at = NOW()');
    values.push(id);

    await pool.query(
      `UPDATE promotions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    // Get the updated promotion
    const [updated] = await pool.query(
      `SELECT p.*, u1.full_name as created_by_name, u2.full_name as updated_by_name
       FROM promotions p
       LEFT JOIN users u1 ON p.created_by = u1.id
       LEFT JOIN users u2 ON p.updated_by = u2.id
       WHERE p.id = ?`,
      [id]
    );

    const formatted = {
      ...updated[0],
      image_url: getFullUrl(updated[0].image_url),
      video_url: getFullUrl(updated[0].video_url),
      thumbnail_url: getFullUrl(updated[0].thumbnail_url),
    };

    res.json({ 
      success: true, 
      data: formatted,
      message: 'Promotion updated successfully' 
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update promotion',
      error: error.message 
    });
  }
};

// ==================== DELETE PROMOTION ====================
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    // Check if promotion exists
    const [existing] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Promotion not found' 
      });
    }

    if (permanent === 'true') {
      // Permanent delete - remove files
      const promotion = existing[0];
      const files = [promotion.image_url, promotion.video_url, promotion.thumbnail_url];
      for (const file of files) {
        if (file && file.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        }
      }
      await pool.query('DELETE FROM promotions WHERE id = ?', [id]);
      res.json({ 
        success: true, 
        message: 'Promotion permanently deleted' 
      });
    } else {
      // Soft delete - archive
      await pool.query('UPDATE promotions SET status = "archived" WHERE id = ?', [id]);
      res.json({ 
        success: true, 
        message: 'Promotion archived' 
      });
    }
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete promotion',
      error: error.message 
    });
  }
};

// ==================== PUBLISH PROMOTION ====================
exports.publishPromotion = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if promotion exists
    const [existing] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Promotion not found' 
      });
    }

    // Update status to published
    await pool.query(
      `UPDATE promotions 
       SET status = 'published', 
           published_at = NOW(),
           updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    // Get the updated promotion
    const [updated] = await pool.query(
      `SELECT p.*, u1.full_name as created_by_name 
       FROM promotions p
       LEFT JOIN users u1 ON p.created_by = u1.id
       WHERE p.id = ?`,
      [id]
    );

    const formatted = {
      ...updated[0],
      image_url: getFullUrl(updated[0].image_url),
      video_url: getFullUrl(updated[0].video_url),
      thumbnail_url: getFullUrl(updated[0].thumbnail_url),
    };

    res.json({ 
      success: true, 
      data: formatted,
      message: 'Promotion published successfully' 
    });
  } catch (error) {
    console.error('Error publishing promotion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to publish promotion',
      error: error.message 
    });
  }
};

// ==================== SCHEDULE PROMOTION ====================
exports.schedulePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { publish_at } = req.body;

    if (!publish_at) {
      return res.status(400).json({ 
        success: false, 
        message: 'Publish date/time is required' 
      });
    }

    // Check if promotion exists
    const [existing] = await pool.query('SELECT * FROM promotions WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Promotion not found' 
      });
    }

    // Update status to scheduled
    await pool.query(
      `UPDATE promotions 
       SET status = 'scheduled', 
           publish_at = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [publish_at, id]
    );

    // Get the updated promotion
    const [updated] = await pool.query(
      `SELECT p.*, u1.full_name as created_by_name 
       FROM promotions p
       LEFT JOIN users u1 ON p.created_by = u1.id
       WHERE p.id = ?`,
      [id]
    );

    const formatted = {
      ...updated[0],
      image_url: getFullUrl(updated[0].image_url),
      video_url: getFullUrl(updated[0].video_url),
      thumbnail_url: getFullUrl(updated[0].thumbnail_url),
    };

    res.json({ 
      success: true, 
      data: formatted,
      message: 'Promotion scheduled successfully' 
    });
  } catch (error) {
    console.error('Error scheduling promotion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to schedule promotion',
      error: error.message 
    });
  }
};