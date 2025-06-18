const express = require('express')

const router = express.Router()

//middleware
router.use(express.json())

const {payByCash} = require('../controllers/payment_controller')

router.post('/pay_by_cash', payByCash)

module.exports = router