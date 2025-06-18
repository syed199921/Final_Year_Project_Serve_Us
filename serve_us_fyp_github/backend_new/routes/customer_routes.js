const express = require('express')
const router = express.Router()
const {getCustomer} = require('../controllers/customer_controller')
//middleware
router.use(express.json())

router.post('/get_customer', getCustomer)


module.exports = router