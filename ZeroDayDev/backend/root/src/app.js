'use strict';

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const compression  = require('compression');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');

const { highlightRouter } = require('./routes/highlightRoutes');
const memberRoutes         = require('./routes/memberRoutes');
const projectRoutes        = require('./routes/projectRoutes');
const chatRoutes           = require('./routes/chatRoutes');
const errorHandler         = require('./middleware/errorHandler');
const logger               = require('./utils/logger');

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin(origin, callback) {
    const allowed = (process.env.CLIENT_URL || '').split(',').map(s => s.trim());
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin || allowed.includes('*') || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

// ── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// ── Request logging (HTTP) ──────────────────────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
  skip:   (req) => req.url === '/health',   // silence health-check spam
}));

// ── Global rate limiter ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests, please slow down.' },
});
app.use('/api', globalLimiter);

// Stricter limiter for admin write operations
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Write rate limit exceeded.' },
});
app.use('/api/members',  writeLimiter);
app.use('/api/projects', writeLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/highlights', highlightRouter);
app.use('/api/members',    memberRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/chat',       chatRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
