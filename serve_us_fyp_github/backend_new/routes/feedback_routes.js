const express = require('express')
const router = express.Router()

//middleware
router.use(express.json())

const {giveFeedback, getReviewScores} = require('../controllers/feedback_controller')

router.post('/give_feedback', giveFeedback)
router.post('/get_review_scores', getReviewScores)

module.exports = router
