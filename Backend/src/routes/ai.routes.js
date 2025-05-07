const express = require('express');
const aiController = require("../controllers/ai.controller")
const authController = require('../controllers/auth.controller');

const router = express.Router();


router.post("/get-review", authController.protect, aiController.getReview)


module.exports = router;