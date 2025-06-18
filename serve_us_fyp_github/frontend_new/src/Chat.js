import React, { useState, useEffect, useRef } from 'react';
import { Layout, Input, Button, Modal, DatePicker, TimePicker, Form, Dropdown, Menu } from 'antd';
import { SendOutlined, CalendarOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Chat.css';
import { Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

function Chat({ socket, senderId, senderName, chatId, chat }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [appointment, setAppointment] = useState({
        date: null,
        time: null,
        location: ''
    });
    const [plusMenuOpen, setPlusMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
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

   useEffect(() => {
    const handler = (data) => {
        setMessages((list) => [...list, data]);
    };
    socket.on("receiveMessage", handler);
    return () => {
        socket.off("receiveMessage", handler);
    };
}, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleOpenModal = () => {
        setIsModalVisible(true);
        setPlusMenuOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setAppointment({ date: null, time: null, location: '' });
    };

    const handleAppointmentChange = (field, value) => {
        setAppointment(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleBookAppointment = async () => {
        setIsModalVisible(false);
        const techRes = await axios.post('http://localhost:5000/technician/get_technician', { id: chat.technician });
        const custRes = await axios.post('http://localhost:5000/customer/get_customer', { id: chat.customer });  
        const technician = techRes.data.technician;
        const customer = custRes.data.customer;
        const appointmentData = {
            customer: customer._id,
            technician: technician._id,
            date: appointment.date,
            time: appointment.time,
            location: appointment.location
        };
        await axios.post('http://localhost:5000/appointment/book_appointment', appointmentData);
        console.log("Appointment booked successfully!");
        setAppointment({ date: null, time: null, location: '' });
    };

    // Dropdown menu for plus sign
    const plusMenu = (
        <Menu
            items={[
                {
                    key: 'calendar',
                    icon: <CalendarOutlined style={{ color: '#4d7cff', fontSize: 22 }} />,
                    label: 'Book Appointment',
                    onClick: handleOpenModal
                }
            ]}
            style={{ minWidth: 160 }}
        />
    );

    return (
        <Layout className='chat-window'>
            <Layout >   
                <Header className="chat-header" style={{ backgroundColor: '#fff', color: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1, color: "rgb(22, 119, 255)" }}>
                    <Title level={4} style={{ color: "rgb(22, 119, 255)" }}>Live Chat</Title>
                </Header>

                {/* --- MESSAGES SECTION --- */}
                <Content className="chat-body" style={{
                    marginBottom: 2,
                    background: "#f5f7fa",
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 48,
                    padding: '40px 0 24px 0',
                }}>
                    {messages.map((message, index) => {
                        // User's own messages on the left, received messages on the right
                        const isUser = message.senderId === senderId;
                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: isUser ? 'flex-start' : 'flex-end',
                                    alignItems: 'flex-end',
                                    padding: '0em 7em'
                                }}
                            >
                                {isUser && (
                                    <div style={{
                                        background: '#dbeee7',
                                        borderRadius: '50%',
                                        width: 34,
                                        height: 34,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 18
                                    }}>
                                        <UserOutlined style={{ color: '#b2b2b2', fontSize: 18 }} />
                                    </div>
                                )}
                                <div
                                    style={{
                                        background: isUser ? '#f3fffc' : '#f6faff',
                                        color: isUser ? '#1a3d34' : '#222',
                                        borderRadius: 18,
                                        padding: '14px 22px',
                                        fontSize: 17,
                                        maxWidth: 420,
                                        minWidth: 60,
                                        boxShadow: '0 1px 8px rgba(77,124,255,0.04)',
                                        textAlign: 'left',
                                        marginLeft: isUser ? 0 : 0,
                                        marginRight: isUser ? 0 : 0,
                                        border: 'none'
                                    }}
                                >
                                    {message.content}
                                </div>
                                {!isUser && (
                                    <div style={{
                                        background: '#4d7cff',
                                        borderRadius: '50%',
                                        width: 38,
                                        height: 38,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 18
                                    }}>
                                        <svg width="22" height="22" fill="#fff" viewBox="0 0 24 24">
                                            <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" opacity="0.15"/>
                                            <path d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" fill="#fff"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </Content>

                {/* --- INPUT FIELD SECTION --- */}
                <div className="chat-footer" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 0 32px 0',
                    background: '#f5f7fa',
                    marginTop: "2em"
                }}>
                    <form
                        onSubmit={e => { e.preventDefault(); sendMessage(); }}
                        style={{
                            width: '60%',
                            maxWidth: '90vw',
                            display: 'flex',
                            alignItems: 'center',
                            background: '#fff',
                            borderRadius: 28,
                            border: '2px solid #b3d1ff',
                            padding: '0 18px',
                            boxShadow: '0 2px 12px rgba(77,124,255,0.04)'
                        }}
                    >
                        {/* Plus Dropdown */}
                        <Dropdown
                            overlay={plusMenu}
                            trigger={['click']}
                            open={plusMenuOpen}
                            onOpenChange={setPlusMenuOpen}
                            placement="topLeft"
                            arrow
                        >
                            <Button
                                type="text"
                                icon={<PlusOutlined style={{ color: '#4d7cff', fontSize: 22 }} />}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    marginRight: 8,
                                    boxShadow: 'none'
                                }}
                            />
                        </Dropdown>
                        <Input
                            type="text"
                            placeholder="Type a message..."
                            value={currentMessage}
                            onChange={e => setCurrentMessage(e.target.value)}
                            onKeyDown={event => {
                                if (event.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: 18,
                                paddingLeft: 0,
                                paddingRight: 0,
                                height: 44,
                                boxShadow: 'none',
                                outline: 'none',
                                width: '100%'
                            }}
                        />
                        <Button
                            type="text"
                            icon={<SendOutlined style={{ color: '#4d7cff', fontSize: 26 }} />}
                            onClick={sendMessage}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                marginLeft: 4,
                                marginRight: 0,
                                boxShadow: 'none'
                            }}
                        />
                    </form>
                </div>
                {/* --- MODAL SECTION (unchanged) --- */}
                <Modal
                    title="Book Appointment"
                    open={isModalVisible}
                    onCancel={handleCloseModal}
                    onOk={handleBookAppointment}
                    okText="Book"
                >
                    <Form layout="vertical">
                        <Form.Item label="Date" required>
                            <DatePicker
                                style={{ width: '100%' }}
                                value={appointment.date}
                                onChange={date => handleAppointmentChange('date', date)}
                            />
                        </Form.Item>
                        <Form.Item label="Time" required>
                            <TimePicker
                                style={{ width: '100%' }}
                                value={appointment.time}
                                onChange={time => handleAppointmentChange('time', time)}
                            />
                        </Form.Item>
                        <Form.Item label="Location" required>
                            <Input
                                placeholder="Enter location"
                                value={appointment.location}
                                onChange={e => handleAppointmentChange('location', e.target.value)}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
}

export default Chat;