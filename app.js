// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
require('dotenv').config({ quiet: true });

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const monsterRoutes = require('./routes/monster');
const encounterRoutes = require('./routes/encounter'); 


const app = express();

// Body & cookies
app.use(express.json());
app.use(cookieParser());

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// ---- API routes ----
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monster', monsterRoutes); 
app.use('/api/encounter', encounterRoutes);

// 404 for unknown endpoints
app.use((req, res, next) => {
  next(createError(404, `Unknown resource: ${req.method} ${req.originalUrl}`));
});

// Centralized error handler
// (If you prefer your own ./errors.js, replace this block with `app.use(errorHandler)`)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message =
    err.message || (status === 404 ? 'Not Found' : 'Internal server error');

  if (status >= 500) {
    // Avoid logging secrets from req; keep it simple
    console.error(err);
  }
  res.status(status).json({ message });
});

module.exports = app;
