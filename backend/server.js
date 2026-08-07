// backend/server.js
require('dotenv').config();
const app = require('./app');
const { testConnection, pool } = require('./config/db');

const PORT = Number(process.env.PORT) || 5000;

function startServer(port = PORT) {
  const server = app.listen(port, () => {
    console.log(`🚀 K-School API running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  }).on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server startup error:', err);
      process.exit(1);
    }
  });
  return server;
}

async function boot() {
  // Test database connection
  await testConnection();
  console.log('✅ Database connected successfully');

  // Start the server
  startServer();

  // Background scheduler: publish scheduled devotionals
  const checkScheduled = async () => {
    try {
      // Check if devotionals table exists first
      const [tables] = await pool.query(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'devotionals'"
      );
      
      if (tables.length === 0) {
        // Table doesn't exist yet, skip silently
        return;
      }

      // Get scheduled devotionals that are due
      const [rows] = await pool.query(
        `SELECT id, title, publish_at FROM devotionals 
         WHERE status = 'scheduled' 
         AND publish_at IS NOT NULL 
         AND publish_at <= NOW()`
      );
      
      if (rows.length > 0) {
        console.log(`📅 Found ${rows.length} scheduled devotional(s) to publish`);
        
        for (const r of rows) {
          // Unset previous featured
          await pool.query('UPDATE devotionals SET is_featured_today = FALSE WHERE is_featured_today = TRUE');
          
          // Publish the scheduled devotional
          await pool.query(
            `UPDATE devotionals 
             SET status = 'published', 
                 published_at = NOW(), 
                 is_featured_today = TRUE,
                 updated_at = NOW()
             WHERE id = ?`,
            [r.id]
          );
          
          console.log(`✅ Published scheduled devotional #${r.id}: "${r.title || 'Untitled'}" at ${new Date().toISOString()}`);
          console.log(`   Scheduled for: ${r.publish_at}`);
        }
      }
    } catch (err) {
      // Only log if it's a real error (not "table doesn't exist")
      if (err.code !== 'ER_NO_SUCH_TABLE') {
        console.error('❌ Scheduler error:', err.message);
      }
    }
  };

  // Run immediately and then every 30 seconds
  console.log('⏰ Scheduler started - checking for scheduled devotionals every 30 seconds');
  
  // Initial check
  await checkScheduled();
  
  // Set interval
  const intervalId = setInterval(checkScheduled, 30 * 1000);

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    clearInterval(intervalId);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  // Don't exit the process, just log the error
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
  // Don't exit the process, just log the error
});

// Start the application
boot().catch((err) => {
  console.error('❌ Failed to start application:', err.message);
  console.error(err.stack);
  process.exit(1);
});