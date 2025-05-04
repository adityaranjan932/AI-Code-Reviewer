const express = require('express');
const aiController = require("../controllers/ai.controller")
const authenticate = require('../middleware/auth');

const router = express.Router();


router.post("/get-review", authenticate, aiController.getReview)


module.exports = router;