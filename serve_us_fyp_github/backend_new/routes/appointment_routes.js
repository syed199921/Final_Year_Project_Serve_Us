const express = require('express')
const router = express.Router()

//middleware
router.use(express.json())

const {bookAppointment, viewCustomerAppointments, viewTechnicianAppointments, updateAppointmentStatus, editAppointment, removeAppointment} = require("../controllers/appointment_controller")

router.post('/book_appointment', bookAppointment)
router.post('/view_customer_appointments', viewCustomerAppointments)
router.post('/view_technician_appointments', viewTechnicianAppointments)
router.post('/update_appointment', updateAppointmentStatus)
router.post('/edit_appointment', editAppointment)
router.post('/remove_appointment', removeAppointment)

module.exports = router