const imageService = require('../services/image.service')

exports.imageReview = async (req, res) => {
  try {
    const prompt = req.body.prompt || ''
    const imageBuffer = req.file ? req.file.buffer : null
    if (!imageBuffer && !prompt) {
      return res.status(400).send('Image or prompt required')
    }
    const result = await imageService(prompt, imageBuffer)
    res.send(result)
  } catch (err) {
    res.status(500).send('Error: ' + err.message)
  }
}
