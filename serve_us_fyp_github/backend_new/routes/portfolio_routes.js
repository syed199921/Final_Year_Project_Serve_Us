const express = require('express')
const router = express.Router()

//middleware
router.use(express.json())

const {addProject, removeProject, editProject, addService, removeService, editService, addProfessionalSummary, viewPortfolio} = require("../controllers/portfolio_controller")

router.post('/add_project', addProject)
router.post('/remove_project', removeProject)
router.post('/edit_project', editProject)
router.post('/add_service', addService)
router.post('/remove_service', removeService)
router.post('/edit_service', editService)
router.post('/add_professional_summary', addProfessionalSummary)
router.post('/view_portfolio', viewPortfolio)



module.exports = router