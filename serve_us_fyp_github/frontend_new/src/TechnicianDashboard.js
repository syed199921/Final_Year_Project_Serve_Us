import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Badge, Button, Card, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    ProfileOutlined,
    AppstoreOutlined,
    MessageOutlined,
    LogoutOutlined,
    BellOutlined,
} from '@ant-design/icons';
import TechnicianDetails from './TechnicianDetails';
import ManagePortfolio from './ManagePortfolio';
import ManageInventory from './ManageInventory';
import JoinChat from './JoinChat';
import './TechnicianDashboard.css';
import axios from 'axios';
import Appointment from './Appointment';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

function TechnicianDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, technicianName } = location.state || {};

    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [hasChatRequest, setHasChatRequest] = useState(false);
    const [chat, setChat] = useState({});

    // Poll for chat requests every 5 seconds
    useEffect(() => {
        let interval;
        const fetchChatRequests = async () => {
            if (!user?.userId) return;
            try {
                const res = await axios.post('http://localhost:5000/chat/user-chats', { userId: user.userId });
                if (res.data.chats && res.data.chats.length > 0) {
                    setChat(res.data.chats[0]);
                } else {
                    setChat({});
                }
                setHasChatRequest(res.data.chats && res.data.chats.length > 0);
            } catch (err) {
                setHasChatRequest(false);
            }
        };
        fetchChatRequests();
        interval = setInterval(fetchChatRequests, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const menuItems = [
        {
            key: 'details',
            icon: <UserOutlined />,
            label: 'View Details',
        },
        {
            key: 'portfolio',
            icon: <ProfileOutlined />,
            label: 'Manage Portfolio',
        },
        {
            key: 'inventory',
            icon: <AppstoreOutlined />,
            label: 'Manage Inventory',
        },
        {
            key: 'chat',
            icon: hasChatRequest ? (
                <Badge dot offset={[0, 0]}>
                    <MessageOutlined />
                </Badge>
            ) : (
                <MessageOutlined />
            ),
            label: <span>Chat</span>,
        },
        {
            key: 'appointment',
            icon: <BellOutlined />,
            label: 'Appointments',
        },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return <TechnicianDetails user={user} />;
            case 'portfolio':
                return <ManagePortfolio user={user} />;
            case 'inventory':
                return <ManageInventory user={user} />;
            case 'chat':
                return <JoinChat user={user} chat={chat} />;
            case 'appointment':
                return <Appointment customerId={user?.userId} user={user} />;
            default:
                return <TechnicianDetails user={user} />;
        }
    };

    const handleMenuClick = async (e) => {
        setActiveTab(e.key);
        if (e.key === 'logout') {
            await axios.post('http://localhost:5000/chat/clear-chats');
            navigate('/');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <Sider
                width={260}
                style={{
                    background: '#fff',
                    borderRight: '1px solid #f0f0f0',
                    padding: '24px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
                trigger={null}
                collapsible={false}
            >
                <div>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <img
                            src="/serve_us_logo.png"
                            alt="Serve-Us Logo"
                            style={{ width: 180, height: 60, borderRadius: '50%', marginBottom: 12 }}
                        />
                        <div style={{ fontWeight: 700, fontSize: 22, marginTop: 12, color: 'rgb(22, 119, 255)' }}>
                            Technician Dashboard
                        </div>
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[activeTab]}
                        onClick={handleMenuClick}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            fontSize: 16,
                            marginTop: '2em'

                        }}
                        items={[
                            ...menuItems,
                            {
                                key: 'logout',
                                icon: <LogoutOutlined />,
                                label: 'Log Out',
                                style: { display: 'none' }, // Hide from main menu, show as button below
                            },
                        ]}
                    />
                    <div style={{ padding: '0 24px', marginTop: '3em' }}>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Text strong>Manage your profile</Text>
                            <div style={{ color: '#888', fontSize: 13 }}>
                                Update your technician details and keep your information up to date.
                            </div>
                        </Card>
                        <Card size="small" style={{ marginBottom: 16 }}>
                            <Text strong>Portfolio & Inventory</Text>
                            <div style={{ color: '#888', fontSize: 13 }}>
                                Showcase your skills and manage your available tools and parts.
                            </div>
                        </Card>
                    </div>
                </div>
                <div style={{ padding: '0 24px', marginTop: '5em' }}>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        block
                        onClick={async () => {
                            await axios.post('http://localhost:5000/chat/clear-chats');
                            navigate('/login');
                        }}
                        style={{
                            borderRadius: 8,
                            background: 'rgb(22, 119, 255)',
                            
                        }}
                    >
                        Log Out
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Header
                    style={{
                        background: '#fff',
                        borderBottom: '1px solid #f0f0f0',
                        padding: '0 32px',
                        fontSize: 22,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'rgb(22, 119, 255)',
                        height: 64,
                    }}
                >
                    <span>
                        {activeTab === 'details' && 'Technician Details'}
                        {activeTab === 'portfolio' && 'Portfolio'}
                        {activeTab === 'inventory' && 'Inventory'}
                        {activeTab === 'chat' && 'Chat'}
                        {activeTab === 'appointment' && 'Appointments'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 400, color: 'black', fontSize: 13 }}>{technicianName}</span>
                        <Avatar icon={<UserOutlined />} />
                    </span>
                </Header>
                <Content style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
}

export default TechnicianDashboard;