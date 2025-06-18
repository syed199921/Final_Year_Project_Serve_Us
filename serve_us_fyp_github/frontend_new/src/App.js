import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './LogIn';
import SignUp from './SignUp';
import TechnicianDashboard from './TechnicianDashboard';
import ManageInventory from './ManageInventory';
import JoinChat from './JoinChat';
import CustomerChatMain from './CustomerChatMain';
import Chat from './Chat';
import ChatBot from './ChatBot'; 
import LandingPage from './LandingPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<TechnicianDashboard />} />
                <Route path="/inventory" element={<ManageInventory />} />
                <Route path="/JoinChat" element={<JoinChat />} /> 
                <Route path="/Chat" element={<Chat />} /> 
                <Route path="/login" element={<LogIn />} />
                <Route path="/CustomerChatMain" element={<CustomerChatMain />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route path="/" element={<LandingPage />} />

            </Routes>
        </Router>
    );
}

export default App;

// import "./App.css";
// import io from "socket.io-client";
// import { useState, useEffect } from "react";
// import Chat from "./Chat";
// import axios from "axios";


// const socket = io.connect("http://localhost:5000");

// function JoinChat({ user, chat }) {
//   const [showChat, setShowChat] = useState(false);
//   const [senderName, setSenderName] = useState("");
//   const [receiverName, setReceiverName] = useState("");
//   const [senderId, setSenderId] = useState("");
//   const [receiverId, setReceiverId] = useState("");

//   const chatId = chat._id

//   useEffect(() => {
//     // const fetchTechnicianDetails = async () => {
//     //   try {
//     //     const response = await axios.post('http://localhost:5000/technician/get_technician', { id: user.userId });
//     //     console.log(chat)
//     //   } catch (error) {
//     //     console.error('Error fetching technician details:', error);
//     //   }
//     // };

//     // const fetchCustomerDetails = async () => {
//     //   try {
//     //     const response = await axios.post('http://localhost:5000/customer/get_customer', { id: user.userId });
//     //     setSenderName(response.data.customer.fullName);
//     //   } catch (error) {
//     //     console.error('Error fetching customer details:', error);
//     //   }
//     // };

//     const fetchUserDetails = async () => {
//       try {
//        const techResponse = await axios.post('http://localhost:5000/technician/get_technician', { id: chat.technician }); 
//        const technician = techResponse.data.technician;
//        const customerResponse = await axios.post('http://localhost:5000/customer/get_customer', { id: chat.customer });
//        const customer = customerResponse.data.customer;

//        console.log('chat', chat);
//        console.log("Technician:", technician);
//         console.log("Customer:", customer);

//        if(user.role === "Technician") {
//          setSenderName(technician.fullName);
//          setReceiverName(customer.fullName);
//          setSenderId(technician._id);
//          setReceiverId(customer._id);
//        }
//        else if(user.userType === "Customer") {
//          setSenderName(customer.fullName);
//          setReceiverName(technician.fullName);
//           setSenderId(customer._id);
//           setReceiverId(technician._id);
//        }


       
//       } catch (error) {
//         console.error('Error fetching user details:', error);
//       }
//     }


//    fetchUserDetails()
  
//       try {
//         socket.emit("joinChat", {chatId: chatId});
//         console.log(`User ${user.userId} joined chat ${chatId}`);
//         setShowChat(true); 
//       } catch (error) {
//         console.error("Error joining chat:", error);
//       }
    

//   }, [user]);

//   return (
//     <div className="App">
//       {showChat ? (
//         <Chat socket={socket} senderId={senderId} senderName={senderName} chatId={chatId} />
//       ) : (
//         <div className="joinChatContainer">
//           <h3>Joining Chat...</h3>
//         </div>
//       )}
//     </div>
//   );
// }

// export default JoinChat;