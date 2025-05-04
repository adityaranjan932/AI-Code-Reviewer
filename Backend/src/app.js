const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser

const aiRoutes = require('./routes/ai.routes');
const imageRoutes = require('./routes/image.routes');
const authRoutes = require('./routes/auth.routes'); // Import auth routes

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Allow frontend origin
    credentials: true // Allow cookies and authorization headers
}));
app.use(express.json({ limit: '16kb' })); // Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Body parser, reading data from url
app.use(cookieParser()); // Use cookie-parser middleware

// Routes
app.use('/ai', aiRoutes);
app.use('/ai', imageRoutes); // Assuming image routes are also under /ai based on frontend calls
app.use('/api/auth', authRoutes); // Mount auth routes under /api/auth

// Basic root route
app.get('/', (req, res) => {
  res.send('AI Code Reviewer Backend is running!');
});

// Global Error Handling (Example - can be expanded)
app.use((err, req, res, next) => {
  console.error('ERROR 💥', err);
  // Ensure statusCode and status are set before sending response
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle JWT errors specifically if they reach here (though 'protect' should catch them)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err.statusCode = 401;
      err.message = err.message || 'Authentication error';
  }


  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Optional: show stack in dev
  });
});


module.exports = app;