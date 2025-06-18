import React, { useState, useRef, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar, Typography, Modal, Card, Menu, Spin } from 'antd';
import { UserOutlined, RobotOutlined, SendOutlined, MessageOutlined, CalendarOutlined, CommentOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import JoinChat from './JoinChat'; 
import Appointment from './Appointment';
import {  FileSearchOutlined, } from '@ant-design/icons';


const { Header, Content, Sider } = Layout;
const { Text } = Typography;



function ChatBot() {
    const location = useLocation();
    const user = location.state?.user;
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you today?' }
    ]);
    const handleShowPortfolio = async (tech) => {
        setPortfolioLoading(true);
        setPortfolioModalVisible(true);
        try {
            const res = await axios.post('http://localhost:5000/portfolio/view_portfolio', {
                technician_id: tech._id
            });
            setPortfolioData(res.data.portfolio);
        } catch (err) {
            setPortfolioData({ professionalSummary: "Failed to load portfolio." });
        }
        setPortfolioLoading(false);
    };

    const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
    const [portfolioData, setPortfolioData] = useState(null);
    const [portfolioLoading, setPortfolioLoading] = useState(false);
    const [input, setInput] = useState('');
    const [customer, setCustomer] = useState({fullName: 'Loading...'});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('chatbot');
    const [loadingTechnicians, setLoadingTechnicians] = useState(false);
    const [technicians, setTechnicians] = useState([]);
    const [chat, setChat] = useState({});
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const fetchCustomerDetails = async (userId) => {
    try {
        console.log('Fetching customer details for userId:', userId);
        const res = await axios.post('http://localhost:5000/customer/get_customer', { id: userId });
        return res.data.customer;
        console.log(res.data.customer);
    } catch (err) {
        // handle error
        return null;
    }
};

const getChatbotResponse = async (question) => {
    try {
        const res = await axios.post('http://localhost:5000/chatbot/message', { question: question });
        return res.data.answer;
    } catch (err) {
        return "Sorry, I couldn't get a response from the chatbot.";
    }
};

    useEffect(() => {
         if (user && user.userId) {
        fetchCustomerDetails(user.userId).then(customer => {
            setCustomer(customer);
            console.log(customer);
        });
    }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, user]);

    // Fetch and display technicians when user asks to consult a technician
    const fetchTechnicians = async () => {
        setLoadingTechnicians(true);
        try {
            // 1. Get nearby technicians
            const nearbyRes = await axios.post('http://localhost:5000/technician/nearby_technicians', {
                customer: user.userId,
                technicianType: 'Plumber'

            });

            console.log('Nearby Technicians:', nearbyRes.data.technicians);

            

            const nearbyTechnicians = nearbyRes.data.technicians || [];

            // 2. Get review scores
            const reviewRes = await axios.post('http://localhost:5000/feedback/get_review_scores', {
                technicians: nearbyTechnicians,
                customer: customer
            });
            const reviewScores = reviewRes.data.review_scores || [];

            reviewScores.sort((a, b) => (b.review_score || 0) - (a.review_score || 0));
            
           

            // 3. Get details for each technician (in parallel)
            const details = await Promise.all(
                reviewScores.map(async (score) => {
                    const detailRes = await axios.post('http://localhost:5000/technician/get_technician', { id: score.technician });
                    return {
                        ...detailRes.data.technician,
                        review_score: score.review_score
                    };
                })
            );

           

            setTechnicians(details);
        } catch (err) {
            setTechnicians([]);
        }
        setLoadingTechnicians(false);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { sender: 'user', text: input }]);

        // Check if user wants to consult a technician
       const consultKeywords = [
            "talk to a technician",
            "chat with a technician",
            "consult a technician",
            "need a technician",
            "call a technician",
            "contact a technician",
            "connect me to a technician",
            "connect me with a technician",
            "speak to a technician",
            "get me a technician",
            "find a technician",
            "show me technicians",
            "show available technicians",
            "show nearby technicians",
            "help from a technician",
            "book a technician",
            "schedule a technician",
            "technician help",
            "technician support",
            "get a technician",
            "get technician help",
            "get technician support",
            "need expert help",
            "need repair expert",
            "need appliance technician"
];
        const lowerInput = input.toLowerCase();
        if (consultKeywords.some(keyword => lowerInput.includes(keyword))) {
            setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: "Sure! Here is a list of available and nearby technicians you can consult." }
            ]);
            setIsModalVisible(true);
            fetchTechnicians();
            }, 500);
        } else {
            // Handle chatbot response
            const chatbotResponse = getChatbotResponse(input);
            setTimeout(async () => {
            const answer = await chatbotResponse;
            setMessages(prev => [
                ...prev,
                { sender: 'bot', text: answer }
            ]);
            }, 500);
        }
        setInput('');
    };

    const handleChatWithTechnician = async (technician) => {
        const chatInfo = await axios.post('http://localhost:5000/chat/create-chat', {
            customerId: user.userId,
            technicianId: technician._id
        });

        console.log('ChatInfo.data:', chatInfo.data);

        
        setIsModalVisible(false);
       
        setChat(chatInfo.data.chat);
        setActiveTab('chat');
    };

    const handleLogout = () => {
        // Add any logout logic here if needed
        navigate('/login');
    };

    // Content for each tab
    const renderTabContent = () => {
        if (activeTab === 'chatbot') {
            return (
                <>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '32px 0 16px 0',
                        background: '#f5f7fa',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{ width: '100%', maxWidth: 600 }}>
                            <List
                                dataSource={messages}
                                renderItem={(msg, idx) => (
                                    <List.Item
                                        key={idx}
                                        style={{
                                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            border: 'none',
                                            padding: '8px 0'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                                        }}>
                                            <Avatar
                                                icon={msg.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                                style={{
                                                    background: msg.sender === 'user' ? '#d1e7dd' : '#1677ff',
                                                    margin: msg.sender === 'user' ? '0 0 0 8px' : '0 8px 0 0'
                                                }}
                                            />
                                            <span style={{
                                                display: 'inline-block',
                                                background: msg.sender === 'user' ? '#e6fffb' : '#f0f5ff',
                                                color: '#222',
                                                padding: '10px 16px',
                                                borderRadius: 18,
                                                maxWidth: 350,
                                                wordBreak: 'break-word',
                                                fontSize: 16
                                            }}>
                                                {msg.text}
                                            </span>
                                        </div>
                                    </List.Item>
                                )}
                            />
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div style={{
                        background: '#fff',
                        borderTop: '1px solid #f0f0f0',
                        padding: '16px 0',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <form onSubmit={handleSend} style={{ display: 'flex', width: '80%', maxWidth: 600 }}>
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                size="large"
                                style={{ borderRadius: 20 }}
                                suffix={
                                    <SendOutlined
                                        style={{ color: '#1677ff', cursor: 'pointer', fontSize: 20 }}
                                        onClick={handleSend}
                                    />
                                }
                                onPressEnter={handleSend}
                                autoFocus
                            />
                        </form>
                    </div>
                    <Modal
            title="Available Nearby Technicians"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={600}
        >
            {loadingTechnicians ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin size="large" />
                </div>
            ) : (
                <List
                    dataSource={technicians}
                    renderItem={tech => (
                        <List.Item
                            actions={[
                                <Button
                                    key="chat"
                                    type="primary"
                                    icon={<MessageOutlined />}
                                    onClick={() => handleChatWithTechnician(tech)}
                                >
                                    Chat
                                </Button>,
                                <FileSearchOutlined
                                    key="portfolio"
                                    style={{ fontSize: 20, color: '#1677ff', cursor: 'pointer' }}
                                    title="View Portfolio"
                                    onClick={() => handleShowPortfolio(tech)}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={
                                    <span>
                                        {tech.fullName} <span style={{ color: '#888', fontSize: 13 }}>Electrician</span>
                                    </span>
                                }
                                description={
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <b>Rating:</b>
                                            <span>
                                                {[...Array(5)].map((_, i) => {
                                                    const score = tech.review_score ? tech.review_score * 5 : 0;
                                                    if (i < Math.floor(score)) {
                                                        return <span key={i} style={{ color: '#faad14', fontSize: 16 }}>★</span>;
                                                    } else if (i < score) {
                                                        return <span key={i} style={{ color: '#faad14', fontSize: 16 }}>★</span>;
                                                    } else {
                                                        return <span key={i} style={{ color: '#e4e4e4', fontSize: 16 }}>★</span>;
                                                    }
                                                })}
                                            </span>
                                            <span style={{ color: '#888', fontSize: 13 }}>
                                                ({tech.review_score ? tech.review_score.toFixed(2) : 'N/A'})
                                            </span>
                                        </div>
                                        <div><b>Phone:</b> {tech.contactNumber || 'N/A'}</div>
                                        <div><b>Location:</b> {user.location || 'N/A'}</div>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Modal>

        {/* Portfolio Modal */}
        <Modal
            title="Technician Portfolio"
            open={portfolioModalVisible}
            onCancel={() => setPortfolioModalVisible(false)}
            footer={null}
            width={700}
            
        >
            {portfolioLoading ? (
                <Spin />
            ) : portfolioData ? (
                <div>
                    <h3>Professional Summary</h3>
                    <p>{portfolioData.professionalSummary || "No summary provided."}</p>
                    <h3>Projects</h3>
                    {portfolioData.projects && portfolioData.projects.length > 0 ? (
                        portfolioData.projects.map((proj, idx) => (
                            <div key={idx} style={{ marginBottom: 16 }}>
                                <b>{proj.title}</b>
                                <div>{proj.description}</div>
                                {proj.images && proj.images.length > 0 && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                        {proj.images.map((img, i) => (
                                            <img key={i} src={img} alt="project" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                                        ))}
                                    </div>
                                )}
                                {proj.testimonials && proj.testimonials.length > 0 && (
                                    <div style={{ marginTop: 4 }}>
                                        <b>Testimonials:</b>
                                        <ul>
                                            {proj.testimonials.map((t, i) => (
                                                <li key={i}>{t.testimonial}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>No projects listed.</div>
                    )}
                    <h3>Services</h3>
                    {portfolioData.services && portfolioData.services.length > 0 ? (
                        <ul>
                            {portfolioData.services.map((srv, idx) => (
                                <li key={idx}>
                                    <b>{srv.title}</b>: {srv.description} <span style={{ color: '#1677ff' }}>({srv.pricing})</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No services listed.</div>
                    )}
                </div>
            ) : (
                <div>No portfolio data found.</div>
            )}
        </Modal>
                </>
            );
        } else if (activeTab === 'chat') {
            return <JoinChat user={user} chat={chat} />; 
        } else if (activeTab === 'appointment') {
            return <Appointment customerId={user?.userId} user={user}/>;
        }
    };

    return (
        <Layout style={{ height: '95vh', background: '#f5f7fa' }}>
            <Sider width={260} style={{ background: '#fff', borderRight: '1px solid #f0f0f0', padding: '24px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <img
                            src="/serve_us_logo.png"
                            alt="Serve-Us Logo"
                            style={{ width: 180, height: 60, borderRadius: '50%', marginBottom: 12 }}
                        />
                        {/* <div style={{ fontWeight: 700, fontSize: 20, marginTop: 12 }}>Serve-Us Chatbot</div> */}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 22, marginTop: 12, color: 'rgb(22, 119, 255)', padding: '0px 20px', marginBottom: '1em' }}>
                            Customer Dashboard
                        </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[activeTab]}
                        onClick={({ key }) => setActiveTab(key)}
                        style={{ border: 'none', background: 'transparent', fontSize: 16 }}
                        items={[
                            {
                                key: 'chatbot',
                                icon: <RobotOutlined />,
                                label: 'AI Chatbot',
                            },
                            {
                                key: 'chat',
                                icon: <CommentOutlined />,
                                label: 'Chat',
                            },
                            {
                                key: 'appointment',
                                icon: <CalendarOutlined />,
                                label: 'Appointments',
                            },
                        ]}
                    />
                    <div style={{ padding: '0 24px', marginTop: 32 }}>
                       <Card size="small" style={{ marginBottom: 16 }}>
                            <Text strong>Appliance not working?</Text>
                            <div style={{ color: '#888', fontSize: 13 }}>
                                Serve-Us has you covered. Just share your issue and it will guide you to a solution!
                            </div>
                        </Card>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Text strong>Need a Technician?</Text>
                            <div style={{ color: '#888', fontSize: 13 }}>
                                Instantly connect with trusted local experts for fast and reliable repairs.
                            </div>
                        </Card>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Text strong>Track Your Appointments</Text>
                            <div style={{ color: '#888', fontSize: 13 }}>
                                View, manage, and update all your appliance service appointments in one place.
                            </div>
                        </Card>
                       
                    </div>
                </div>
                <div style={{ padding: '0 24px', marginBottom: 24 }}>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        block
                        onClick={handleLogout}
                        style={{ borderRadius: 8, background: 'rgb(22, 119, 255)' , marginTop:40}}
                
                    >
                        Log Out
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Header style={{
                    background: '#fff',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '0 32px',
                    fontSize: 22,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'rgb(22, 119, 255)'
                }}>
                    <span>
                        {activeTab === 'chatbot' && 'AI Chat'}
                        {activeTab === 'chat' && 'Chat'}
                        {activeTab === 'appointment' && 'Appointments'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 400, color: 'black', fontSize: 13 }}>{customer.fullName}</span>
                        <Avatar icon={<UserOutlined />} />
                        
                    </span>
                </Header>
                <Content style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
                    {renderTabContent()}
                </Content>
            </Layout>
        </Layout>
    );
}

export default ChatBot;