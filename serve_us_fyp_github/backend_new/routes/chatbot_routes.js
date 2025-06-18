const express = require('express');
const {getChatbotResponse} = require('../controllers/chatbot_controller');

const router = express.Router();

// Route to handle chatbot message
router.post('/message', getChatbotResponse);



module.exports = router;