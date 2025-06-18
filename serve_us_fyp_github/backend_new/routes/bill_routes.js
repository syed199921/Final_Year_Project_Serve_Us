const express = require('express')

const router = express.Router()

//middleware
router.use(express.json())

const {generateBill, getBills, getBill} = require('../controllers/bill_controller')

router.post('/generate_bill', generateBill)
router.get('/get_bills', getBills)
router.get('/get_bill', getBill)

module.exports = router