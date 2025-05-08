// Backend/src/controllers/auth.controller.js
const User = require('../models/User.model');
const ReviewHistory = require('../models/ReviewHistory.model'); // Import ReviewHistory model
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // For promisifying jwt.sign

// Utility function to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d', // Default to 90 days
  });
};

// Utility function to create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000 // Default 90 days
    ),
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Add SameSite attribute
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      // Send the full user object (including names now)
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    // Destructure firstName and lastName from req.body
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide first name, last name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            status: 'fail',
            message: 'Email already in use',
        });
    }

    // Create new user (password hashing is handled by pre-save hook in model)
    const newUser = await User.create({
      firstName, // Save firstName
      lastName,  // Save lastName
      email,
      password,
    });

    // Log in the user immediately after signup
    createSendToken(newUser, 201, res);

  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(el => el.message);
        return res.status(400).json({
            status: 'fail',
            message: `Invalid input data: ${messages.join('. ')}`
        });
    }
    // Handle other errors
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during signup.',
      error: error.message, // Provide error message in development?
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during login.',
      error: error.message,
    });
  }
};

// Add the logout function
exports.logout = (req, res) => {
  // Clear the cookie by setting it to empty and expiring it immediately
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ status: 'success' });
};

// Controller function to get user's review history
exports.getReviewHistory = async (req, res, next) => {
  try {
    // req.user should be populated by the 'protect' middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not authenticated to access history.',
      });
    }

    const history = await ReviewHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-user -__v'); // Exclude user ID and version key from results

    res.status(200).json({
      status: 'success',
      results: history.length,
      data: {
        history,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve review history.',
      error: error.message,
    });
  }
};

// Controller to get the current logged-in user's data
exports.getMe = (req, res, next) => {
  // req.user is populated by the 'protect' middleware
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not logged in or session expired.'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

// Optional: Middleware to protect routes (example)
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it\\'s there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') { // Check cookie and ensure it\\'s not the loggedout value
      token = req.cookies.jwt;
    }

    if (!token) {
      // If no token, proceed without setting req.user
      // The controllers will handle not saving history if req.user is not set.
      return next();
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    // Populate user data including names, excluding password
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
       // If token is present but user doesn't exist (e.g., deleted account),
       // treat as an authentication failure.
       return res.status(401).json({
           status: 'fail',
           message: 'The user belonging to this token does no longer exist.'
       });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser; // Attach user to the request object
    next();
  } catch (error) {
     // Handle specific JWT errors if a token was present but invalid
     let message = 'Invalid token or session expired. Please log in again.';
     if (error.name === 'JsonWebTokenError') {
         message = 'Invalid token. Please log in again.';
     } else if (error.name === 'TokenExpiredError') {
         message = 'Your session has expired. Please log in again.';
     }
     // If an error occurs during token processing (e.g., verification failed),
     // it's an authentication issue.
     return res.status(401).json({
         status: 'fail',
         message: message,
         // error: process.env.NODE_ENV === 'development' ? error.message : undefined
     });
  }
};
