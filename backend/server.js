require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = Number(process.env.PORT) || 5000;

function startServer(port = PORT) {
  app.listen(port, () => {
    console.log(`🚀 K-School API running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  }).on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is busy. Trying ${port + 1}...`);
      app.close?.();
      startServer(port + 1);
    } else {
      console.error('Server startup error:', err);
      process.exit(1);
    }
  });
}

async function boot() {
  await testConnection();
  startServer();
}

boot();
