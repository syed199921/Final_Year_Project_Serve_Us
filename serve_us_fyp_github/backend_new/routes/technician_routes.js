const express = require('express')
const router = express.Router()

//middleware
router.use(express.json())

const {getNearbyTechnicians, setLocation, generateReviewScore, getTechnician} = require('../controllers/technician_controller')
router.post('/get_technician', getTechnician)
router.post('/nearby_technicians', getNearbyTechnicians )
router.post('/location', setLocation)
router.get('/review_scores', generateReviewScore)


module.exports = router