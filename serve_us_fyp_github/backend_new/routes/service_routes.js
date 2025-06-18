const express = require('express')
const router = express.Router()
const {completeService} = require('../controllers/service_controller')
//middleware
router.use(express.json())

router.post('/complete_service', completeService)

module.exports = router