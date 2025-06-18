import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Chat.css';
import { Typography } from 'antd';



const { Header, Content, Sider } = Layout;
const {Title} = Typography;

function Chat({ socket, senderId, chatId }) {

  
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        try {
            console.log('Fetching chats for user:', senderId);
            const response = await axios.post('http://localhost:5000/chat/user-chats', { userId: senderId });
            setChats(response.data.chats);

        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    

  

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                chatId: chatId,
                senderId: senderId,
                content: currentMessage,
            };
            await socket.emit("sendMessage", messageData);
            setMessages((currentMessages) => [...currentMessages, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect( () => {
        socket.on("receiveMessage", (data) => {
          setMessages((list) => [...list, data]);
        });
      }, [socket]);

   

    return (
        <Layout className='chat-window'>
           
            <Layout style={{padding:40}}>
                <Header className="chat-header" style={{ backgroundColor: '#fff', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1 }}>
                    <Title level={4}>Live Chat</Title>
                </Header>

                <Content className="chat-body" style={{marginBottom:2} }>
                    {messages.map((message, index) => (
                        <div key={index} className="message" id={message.senderId === senderId ? "you" : "other"}>
                            <div>
                                <div className="message-content">
                                    <p>{message.content}</p>
                                </div>
                                <div className="message-meta">
                                    <p id='author'>{message.senderId}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Content>

                <div className="chat-footer">
                    <Input
                        type="text"
                        placeholder="Hey..."
                        value={currentMessage}
                        onChange={(event) => setCurrentMessage(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        style={{ flex: 20, marginRight: 0 }}
                    />
                    <Button type="primary" icon={<SendOutlined />} size="small" onClick={sendMessage}>
                    </Button>
                </div>
            </Layout>
        </Layout>
    );
}

export default Chat;