const express = require('express');
const path = require('path');
const createHttpError = require('http-errors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const monsterRoutes = require('./src/routes/monsterRoutes');
const sessionRoutes = require('./src/routes/sessionRoutes');
const partyRoutes = require('./src/routes/partyRoutes');
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const adminRoutes = require('./src/routes/adminRoutes'); // optional admin-only APIs

const errorHandler = require('./errors');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// ---- API ROUTES ----
app.use('/api/auth', authRoutes);
app.use('/api/monsters', monsterRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/parties', partyRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 for unknown endpoints
app.use((req, res, next) => {
  next(createHttpError(404, `Unknown resource: ${req.method} ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;

