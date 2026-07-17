const express = require('express');
const cors = require('cors');
const { errorMiddleware } = require('./middleware/error-middleware');

const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const courseRoutes = require('./routes/course-routes');
const contentRoutes = require('./routes/content-routes');
const publicRoutes = require('./routes/public-routes');
const editorRoutes = require('./routes/editor-routes');
const pastorRoutes = require('./routes/pastor-routes');
const activityRoutes = require('./routes/activity-routes');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = ['localhost', '127.0.0.1', '::1', 'vercel.app'];
    const frontendUrl = process.env.FRONTEND_URL;

    if (frontendUrl && origin === frontendUrl) {
      return callback(null, true);
    }

    if (allowedOrigins.some((allowed) => origin.includes(allowed))) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ success: true, message: 'K-School API is running 🚀' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/editor', editorRoutes);
app.use('/api/v1/pastor', pastorRoutes);
app.use('/api/v1/activity', activityRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorMiddleware);

module.exports = app;
