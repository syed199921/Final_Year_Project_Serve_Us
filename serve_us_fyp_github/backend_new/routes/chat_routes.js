const express = require('express');
const { sendMessage, getMessages, createChatSession, getUserChats, clearChats} = require('../controllers/chat_controller');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

// Route for sending a message with an attachment
router.post('/send-message', upload.single('attachment'), sendMessage);

// Route to get messages for a chat session
router.get('/get-messages', getMessages);


// Route to create a new chat session
router.post('/create-chat',createChatSession);

// Route to get all chat sessions for a user
router.post('/user-chats',getUserChats);

// Route to clear all chats
router.post('/clear-chats', clearChats);






module.exports = router;