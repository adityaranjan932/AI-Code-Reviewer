// Backend/src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout); // Add GET route for logout

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
