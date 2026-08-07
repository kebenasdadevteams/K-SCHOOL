const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get base URL from environment
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Helper function to get full image URL
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // If it starts with /uploads/, prepend base URL
  if (imagePath.startsWith('/uploads/')) {
    return `${BASE_URL}${imagePath}`;
  }
  // If it starts with uploads/ (no leading slash), add it
  if (imagePath.startsWith('uploads/')) {
    return `${BASE_URL}/${imagePath}`;
  }
  // Otherwise, treat as relative path
  return `${BASE_URL}/${imagePath}`;
};

// Helper function to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Get all devotionals (for editor)
exports.getDevotionals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d 
       LEFT JOIN users u ON d.author_id = u.id 
       ORDER BY d.created_at DESC`
    );
    
    // Convert featured_image to full URL for each row
    const formattedRows = rows.map(row => ({
      ...row,
      featured_image: getFullImageUrl(row.featured_image)
    }));
    
    return res.json({ success: true, data: formattedRows });
  } catch (err) {
    console.error('Error fetching devotionals:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve devotionals',
      error: err.message 
    });
  }
};

// Get devotional by ID (for editor)
exports.getDevotionalById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d 
       LEFT JOIN users u ON d.author_id = u.id 
       WHERE d.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }
    
    // Convert featured_image to full URL
    const formattedRow = {
      ...rows[0],
      featured_image: getFullImageUrl(rows[0].featured_image)
    };
    
    return res.json({ success: true, data: formattedRow });
  } catch (err) {
    console.error('Error fetching devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve devotional',
      error: err.message
    });
  }
};

// Create devotional
exports.createDevotional = async (req, res) => {
  try {
    const {
      title,
      content,
      header,
      subtitle,
      excerpt,
      verse_reference,
      verse_text,
      category,
      tags,
      featured_image,
      video_url,
      audio_url,
      status,
      author_id,
      reading_time,
      is_featured_today,
      is_pinned,
      slug,
      publish_at
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title) + '-' + Date.now();

    // Convert tags to JSON string if it's an array
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags || null;

    // Extract just the path part if a full URL was provided
    let imagePath = featured_image;
    if (imagePath && imagePath.startsWith('http')) {
      // If it's a full URL, extract the path
      const urlParts = imagePath.split('/uploads/');
      if (urlParts.length > 1) {
        imagePath = '/uploads/' + urlParts[1];
      } else {
        // Try to extract just the filename
        const filename = imagePath.split('/').pop();
        if (filename) {
          imagePath = '/uploads/' + filename;
        }
      }
    }

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO devotionals (
        title, header, subtitle, slug, category, 
        verse_reference, verse_text, content, 
        featured_image, video_url, audio_url, 
        status, publish_at, author_id, 
        is_featured_today, is_pinned, tags,
        reading_time, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        header || null,
        subtitle || null,
        finalSlug,
        category || 'General',
        verse_reference || null,
        verse_text || null,
        content,
        imagePath || null,
        video_url || null,
        audio_url || null,
        status || 'draft',
        publish_at || null,
        author_id || 1,
        is_featured_today || 0,
        is_pinned || 0,
        tagsJson,
        reading_time || Math.ceil(content.length / 200)
      ]
    );

    // Get the newly created devotional
    const [newDevotional] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d 
       LEFT JOIN users u ON d.author_id = u.id 
       WHERE d.id = ?`,
      [result.insertId]
    );

    // Convert featured_image to full URL
    const formattedDevotional = {
      ...newDevotional[0],
      featured_image: getFullImageUrl(newDevotional[0].featured_image)
    };

    return res.status(201).json({
      success: true,
      data: formattedDevotional,
      message: 'Devotional created successfully'
    });
  } catch (err) {
    console.error('Error creating devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create devotional',
      error: err.message
    });
  }
};

// Update devotional
exports.updateDevotional = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      header,
      subtitle,
      excerpt,
      verse_reference,
      verse_text,
      category,
      tags,
      featured_image,
      video_url,
      audio_url,
      status,
      author_id,
      reading_time,
      is_featured_today,
      is_pinned,
      slug,
      publish_at
    } = req.body;

    // Check if devotional exists
    const [existing] = await pool.query('SELECT id FROM devotionals WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    // Convert tags to JSON string if it's an array
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags || null;

    // Extract just the path part if a full URL was provided
    let imagePath = featured_image;
    if (imagePath && imagePath.startsWith('http')) {
      const urlParts = imagePath.split('/uploads/');
      if (urlParts.length > 1) {
        imagePath = '/uploads/' + urlParts[1];
      } else {
        const filename = imagePath.split('/').pop();
        if (filename) {
          imagePath = '/uploads/' + filename;
        }
      }
    }

    // Update the devotional
    await pool.query(
      `UPDATE devotionals SET
        title = COALESCE(?, title),
        header = ?,
        subtitle = ?,
        slug = COALESCE(?, slug),
        category = COALESCE(?, category),
        verse_reference = ?,
        verse_text = ?,
        content = COALESCE(?, content),
        featured_image = ?,
        video_url = ?,
        audio_url = ?,
        status = COALESCE(?, status),
        publish_at = ?,
        author_id = COALESCE(?, author_id),
        is_featured_today = COALESCE(?, is_featured_today),
        is_pinned = COALESCE(?, is_pinned),
        tags = ?,
        reading_time = COALESCE(?, reading_time),
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        header || null,
        subtitle || null,
        slug,
        category,
        verse_reference || null,
        verse_text || null,
        content,
        imagePath || null,
        video_url || null,
        audio_url || null,
        status,
        publish_at || null,
        author_id,
        is_featured_today || 0,
        is_pinned || 0,
        tagsJson,
        reading_time,
        id
      ]
    );

    // Get the updated devotional
    const [updated] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d 
       LEFT JOIN users u ON d.author_id = u.id 
       WHERE d.id = ?`,
      [id]
    );

    // Convert featured_image to full URL
    const formattedDevotional = {
      ...updated[0],
      featured_image: getFullImageUrl(updated[0].featured_image)
    };

    return res.json({
      success: true,
      data: formattedDevotional,
      message: 'Devotional updated successfully'
    });
  } catch (err) {
    console.error('Error updating devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update devotional',
      error: err.message
    });
  }
};

// Delete devotional
exports.deleteDevotional = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM devotionals WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    await pool.query('DELETE FROM devotionals WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Devotional deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete devotional',
      error: err.message
    });
  }
};

// Publish devotional now
exports.publishNow = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured_today } = req.body;

    const [existing] = await pool.query('SELECT id FROM devotionals WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    await pool.query(
      `UPDATE devotionals SET
        status = 'published',
        published_at = NOW(),
        is_featured_today = COALESCE(?, is_featured_today),
        updated_at = NOW()
      WHERE id = ?`,
      [is_featured_today || 0, id]
    );

    const [updated] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d 
       LEFT JOIN users u ON d.author_id = u.id 
       WHERE d.id = ?`,
      [id]
    );

    // Convert featured_image to full URL
    const formattedDevotional = {
      ...updated[0],
      featured_image: getFullImageUrl(updated[0].featured_image)
    };

    return res.json({
      success: true,
      data: formattedDevotional,
      message: 'Devotional published successfully'
    });
  } catch (err) {
    console.error('Error publishing devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish devotional',
      error: err.message
    });
  }
};

// Schedule devotional
exports.scheduleDevotional = async (req, res) => {
  try {
    const { id } = req.params;
    const { publish_at, make_featured } = req.body;

    if (!publish_at) {
      return res.status(400).json({
        success: false,
        message: 'Publish date/time is required'
      });
    }

    const [existing] = await pool.query('SELECT id FROM devotionals WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Devotional not found'
      });
    }

    await pool.query(
      `UPDATE devotionals SET
        status = 'scheduled',
        publish_at = ?,
        is_featured_today = COALESCE(?, is_featured_today),
        updated_at = NOW()
      WHERE id = ?`,
      [publish_at, make_featured || 0, id]
    );

    const [updated] = await pool.query(
      `SELECT d.*, u.full_name as author_name 
       FROM devotionals d 
       LEFT JOIN users u ON d.author_id = u.id 
       WHERE d.id = ?`,
      [id]
    );

    // Convert featured_image to full URL
    const formattedDevotional = {
      ...updated[0],
      featured_image: getFullImageUrl(updated[0].featured_image)
    };

    return res.json({
      success: true,
      data: formattedDevotional,
      message: 'Devotional scheduled successfully'
    });
  } catch (err) {
    console.error('Error scheduling devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to schedule devotional',
      error: err.message
    });
  }
};

// Get public devotionals
exports.getPublicDevotionals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, header, subtitle, slug, category, 
              verse_reference, verse_text, 
              LEFT(content, 500) as excerpt, 
              featured_image, status, published_at,
              is_featured_today, author_name
       FROM devotionals 
       WHERE status = 'published' 
       ORDER BY published_at DESC 
       LIMIT 50`
    );
    
    // Convert featured_image to full URL for each row
    const formattedRows = rows.map(row => ({
      ...row,
      featured_image: getFullImageUrl(row.featured_image)
    }));
    
    return res.json({ success: true, data: formattedRows });
  } catch (err) {
    console.error('Error fetching public devotionals:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve devotionals',
      error: err.message
    });
  }
};

// Get today's devotional
exports.getTodayDevotional = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM devotionals 
       WHERE is_featured_today = 1 AND status = 'published' 
       LIMIT 1`
    );
    
    if (rows.length === 0) {
      // Fallback: get the latest published devotional
      const [fallback] = await pool.query(
        `SELECT * FROM devotionals 
         WHERE status = 'published' 
         ORDER BY published_at DESC 
         LIMIT 1`
      );
      
      if (fallback.length > 0) {
        const formattedFallback = {
          ...fallback[0],
          featured_image: getFullImageUrl(fallback[0].featured_image)
        };
        return res.json({ success: true, data: formattedFallback });
      }
      return res.json({ success: true, data: null });
    }
    
    const formattedRow = {
      ...rows[0],
      featured_image: getFullImageUrl(rows[0].featured_image)
    };
    
    return res.json({ success: true, data: formattedRow });
  } catch (err) {
    console.error('Error fetching today\'s devotional:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve today\'s devotional',
      error: err.message
    });
  }
};

// Get devotional by slug
exports.getDevotionalBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM devotionals 
       WHERE slug = ? AND status = 'published' 
       LIMIT 1`,
      [slug]
    );
    
    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    
    const formattedRow = {
      ...rows[0],
      featured_image: getFullImageUrl(rows[0].featured_image)
    };
    
    return res.json({ success: true, data: formattedRow });
  } catch (err) {
    console.error('Error fetching devotional by slug:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve devotional',
      error: err.message
    });
  }
};