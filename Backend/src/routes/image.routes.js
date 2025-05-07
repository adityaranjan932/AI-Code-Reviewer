const imageController = require('../controllers/image.controller')
const express = require('express')
const authController = require('../controllers/auth.controller')
const router = express.Router()
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/image-review', authController.protect, upload.single('image'), imageController.imageReview)

module.exports = router
