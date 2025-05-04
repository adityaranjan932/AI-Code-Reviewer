const imageController = require('../controllers/image.controller')
const express = require('express')
const authenticate = require('../middleware/auth')
const router = express.Router()
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/image-review', authenticate, upload.single('image'), imageController.imageReview)

module.exports = router
