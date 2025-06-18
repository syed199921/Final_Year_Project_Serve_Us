import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";
import axios from "axios";
import ChatNew from './ChatNew'

const socket = io.connect("http://localhost:5000");

function CustomerChatMain() {
  const [showChat, setShowChat] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderId, setSenderId] = useState("");
  const [chatId, setChatId] = useState("");

  const handleJoinChat = async (e) => {
    e.preventDefault();
  
    if (senderId !== "" && chatId !== "")
    {
      await socket.emit("joinChat", {chatId: chatId});
      console.log(`Customer ${senderId} joined chat ${chatId}`);
      setShowChat(true); 
    }
}

//   useEffect(() => {
//     return () => {
//       if (showChat) {
//         try {
//           socket.emit("leave_room", chatId);
//           console.log(`Customer ${customerId} left chat ${chatId}`);
//         } catch (error) {
//           console.error("Error leaving chat:", error);
//         }
//       }
//     };
//   }, [showChat, chatId, customerId]);

  return (
    <div className="App">
      {showChat ? (
        <ChatNew socket={socket} senderId={senderId}  chatId={chatId} />
      ) : (
        <div className="joinChatContainer">
          <h3>Join Chat</h3>
          <form className="joinChatForm">
            <div className="form-group">
              <label htmlFor="customerId">User ID</label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                placeholder="Enter user ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="chatId">Chat ID</label>
              <input
                type="text"
                id="chatId"
                name="chatId"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter the chat ID"
                required
              />
            </div>
            <button type="submit" className="joinChatButton" onClick={handleJoinChat}>Join Chat</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerChatMain;


