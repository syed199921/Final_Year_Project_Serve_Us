const express = require('express')
const {signUp, logIn, getGeolocation, getIP, updateUser, removeUser, getUsers} = require('../controllers/user_controller')
const { get } = require('mongoose')

const router = express.Router()

//middleware
router.use(express.json())

router.post('/signup', signUp)
router.post('/login', logIn)
router.post('/update_user', updateUser)
router.get('/get_geolocation', getGeolocation )
router.get('/get_ip', getIP)
router.get('/get_users', getUsers)
router.delete('/remove_user', removeUser)

module.exports = router