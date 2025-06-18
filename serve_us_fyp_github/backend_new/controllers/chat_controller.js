const Chat = require('../models/chat_model');
const Message = require('../models/message_model');

// Create a new chat session
const createChatSession = async (req, res) => {
    const { customerId, technicianId } = req.body;

    try {
        const chat = new Chat({ customer: customerId, technician: technicianId });
        await chat.save();
        return res.status(201).json({ message: "Chat session created successfully", "chat" :chat});
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Send a message in a chat session

const sendMessage = async (req, res) => {
    const { chatId, senderId, content } = req.body;
    const attachment = req.file; // Assuming you're using multer for file uploads

    try {
        // Validate that either content or an attachment is provided
        if (!content && !attachment) {
            return res.status(400).json({ message: "Message must contain text or an attachment" });
        }

        // Create a new message
        const message = new Message({
            chatId,
            senderId,
            content: content || null, 
            attachment: attachment ? attachment.path : null,
        });

        await message.save();

        // Optionally, emit the message to the socket here if using WebSockets

        return res.status(201).json({ message: "Message sent successfully", message });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Get messages for a chat session
const getMessages = async (req, res) => {
    const { chatId } = req.body;

    try {
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Get all chat sessions for a user
const getUserChats = async (req, res) => {
    const { userId } = req.body;
    console.log(userId)
    try {
        const chats = await Chat.find({
            $or: [
                { technician: userId },
                { customer: userId }
            ]
        });
        return res.status(200).json({ chats });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

const clearChats = async (req, res) => {
    try {
        await Chat.deleteMany({});
        await Message.deleteMany({});
        return res.status(200).json({ message: "All chats cleared successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};


module.exports = {
    createChatSession,
    sendMessage,
    getMessages,
    getUserChats,
    clearChats
};