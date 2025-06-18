const { Server } = require("socket.io");
const Chat = require("../models/chat_model");
const Message = require("../models/message_model");

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Join a chat room
        socket.on("joinChat", async (data) => {
            console.log("joinChat event received:", data); // Debug log
        
            try {
                const { chatId } = data;
                console.log("Chat ID:", chatId); // Debug log
        
                const chat = await Chat.findById(chatId);
                if (!chat) {
                    console.log("Chat not found for ID:", chatId); // Debug log
                    return socket.emit("error", { message: "Chat not found" });
                }
        
                socket.join(chatId);
                console.log(`Client ${socket.id} joined chat ${chatId}`);
            } catch (error) {
                console.error("Error joining chat:", error);
                socket.emit("error", { message: "Failed to join chat" });
            }
        });

        // Handle sending a message
        socket.on("sendMessage", async (data) => {
            const { chatId, senderId, content } = data;
            console.log("sendMessage event received:", data); // Debug log

            try {
                // Save the message to the database
                const message = new Message({
                    chatId,
                    senderId,
                    content,
                });
                await message.save();

                 socket.to(chatId).emit("receiveMessage", data);
                console.log(`Message sent to chat ${chatId}:`, message);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // Handle uploading an attachment
        socket.on("uploadAttachment", async (data) => {
            const { chatId, senderId, attachment } = data;

            try {
                // Save the attachment as a message in the database
                const message = new Message({
                    chatId,
                    senderId,
                    content: null,
                    attachment, // Assuming `attachment` is the file path or URL
                });
                await message.save();

                // Emit the attachment to all clients in the chat room
                io.to(chatId).emit("receiveAttachment", message);
                console.log(`Attachment sent to chat ${chatId}:`, message);
            } catch (error) {
                console.error("Error uploading attachment:", error);
                socket.emit("error", { message: "Failed to upload attachment" });
            }
        });
        

        // Handle client disconnection
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
   
    });
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = {
    initSocket,
    getIo,
};