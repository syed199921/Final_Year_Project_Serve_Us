import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Chat from "./Chat";
import axios from "axios";

const socket = io.connect("http://localhost:5000");

function JoinChat({ user, chat }) {
  const [showChat, setShowChat] = useState(false);
  const [senderName, setSenderName] = useState("");

  const chatId = chat._id

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      try {
        const response = await axios.post('http://localhost:5000/technician/get_technician', { id: user.userId });
        setSenderName(response.data.technician.fullName);
        console.log(chat)
      } catch (error) {
        console.error('Error fetching technician details:', error);
      }
    };

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.post('http://localhost:5000/customer/get_customer', { id: user.userId });
        setSenderName(response.data.customer.fullName);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };
    


    if (user.role === "Technician") {
      fetchTechnicianDetails();
    } 
    else if (user.userType === "Customer") {
      fetchCustomerDetails();
    }
    

    
      try {
        socket.emit("joinChat", {chatId: chatId});
        console.log(`User ${user.userId} joined chat ${chatId}`);
        setShowChat(true); 
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    

  }, [user]);

  return (
    <div className="App">
      {showChat ? (
        <Chat socket={socket} senderId={user.userId} senderName={senderName} chatId={chatId} chat={chat}/>
      ) : (
        <div className="joinChatContainer">
          <h3>Joining Chat...</h3>
        </div>
      )}
    </div>
  );
}

export default JoinChat;