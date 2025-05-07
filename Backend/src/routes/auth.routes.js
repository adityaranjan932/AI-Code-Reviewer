// Backend/src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout); // Add GET route for logout

// Route to get review history for the logged-in user
// The protect middleware will ensure only logged-in users can access this
router.get('/history', authController.protect, authController.getReviewHistory);

// Route to get current user details (verifies session)
router.get('/me', authController.protect, authController.getMe);

// Example of a protected route using the updated protect middleware
// router.get('/me', authController.protect, (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: req.user // req.user now includes names
//     }
//   });
// });

module.exports = router;
