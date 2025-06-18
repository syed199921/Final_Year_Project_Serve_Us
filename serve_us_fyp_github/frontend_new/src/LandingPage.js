import React from 'react';
import { Button, Typography, Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

function LandingPage() {
    return (
        <div style={{ background: '#f5f7fa', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{
                background: '#e9ecef',
                padding: '48px 0 32px 0',
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
                    <div style={{ flex: 1, minWidth: 320 }}>
                        <img
                            src="/serve_us_logo.png" 
                            alt="Serve-Us Logo"
                            style={{ width: 150, height: 64, marginBottom: 24 }}
                        />
                        <Title style={{ color: '#1677ff', fontSize: 38, marginBottom: 16 }}>Troubleshoot & Repair Appliances Effortlessly</Title>
                        <Paragraph style={{ fontSize: 18, marginBottom: 32 }}>
                            Serve-Us helps you diagnose, troubleshoot, and repair your appliances using our intelligent chatbot. If you need further help, instantly connect with trusted local technicians.
                        </Paragraph>
                        <Link to="/login">
                            <Button type="primary" size="large" style={{ marginRight: 16 }}>Get Started</Button>
                        </Link>
                        <Link to="/chatbot">
                            <Button size="large">Try Chatbot Demo</Button>
                        </Link>
                    </div>
                    <div style={{ flex: 1, minWidth: 320, textAlign: 'center' }}>
                        <img
                            src="tools+chat.jpg"
                            alt="Troubleshooting"
                            style={{ maxWidth: 350, width: '100%', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ background: '#fff', padding: '48px 0 24px 0' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <Row gutter={32} justify="center">
                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ textAlign: 'center', minHeight: 220 }}>
                                <img src="https://img.icons8.com/fluency/48/000000/robot-2.png" alt="Chatbot" />
                                <Title level={4} style={{ marginTop: 16 }}>AI Chatbot Assistance</Title>
                                <Paragraph>
                                    Diagnose and fix appliance issues instantly with our intelligent chatbot.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ textAlign: 'center', minHeight: 220 }}>
                                <img src="https://img.icons8.com/color/48/000000/worker-beard.png" alt="Technicians" />
                                <Title level={4} style={{ marginTop: 16 }}>Connect with Experts</Title>
                                <Paragraph>
                                    Get connected with trusted local technicians for reliable service.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ textAlign: 'center', minHeight: 220 }}>
                                <img src="https://img.icons8.com/color/48/000000/graph-report.png" alt="Insights" />
                                <Title level={4} style={{ marginTop: 16 }}>Data-Driven Insights</Title>
                                <Paragraph>
                                    Make informed decisions with AI-powered recommendations and service analytics.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* How it Works Section */}
            <div style={{ background: '#f5f7fa', padding: '32px 0' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <Title level={3} style={{ marginBottom: 32 }}>How It Works</Title>
                    <Row gutter={32} justify="center">
                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ minHeight: 160 }}>
                                <Title level={4}>1. Start Chat</Title>
                                <Paragraph>
                                    Tell the chatbot your appliance issue and get instant troubleshooting steps.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ minHeight: 160 }}>
                                <Title level={4}>2. Try Solutions</Title>
                                <Paragraph>
                                    Follow the guided solutions. If the problem persists, get matched with a technician.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card bordered={false} style={{ minHeight: 160 }}>
                                <Title level={4}>3. Connect & Repair</Title>
                                <Paragraph>
                                    Chat with a local expert, schedule a visit, and get your appliance fixed.
                                </Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Call to Action Section */}
            <div style={{ background: '#e9ecef', padding: '40px 0', marginTop: 24 }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <Title level={3}>Find the right solution for your appliance</Title>
                    <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                        Whether you want to fix it yourself or need a professional, Serve-Us is here to help.
                    </Paragraph>
                    <Link to="/login">
                        <Button type="primary" size="large" style={{ marginRight: 16 }}>Get Started</Button>
                    </Link>
                    <Link to="/chatbot">
                        <Button size="large">Try Chatbot Demo</Button>
                    </Link>
                </div>
            </div>

           <div style={{
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    fontSize: 15,
    color: '#2d3a4a'
}}>
    <div style={{ flex: 1, minWidth: 220, maxWidth: 330, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: 180 , marginTop: 10}}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <img
                src="/serve_us_logo.png" 
                alt="Serve-Us Logo"
                style={{ width: 110, height: 35, marginRight: 10 }}
            />
        </div>
        <div style={{ color: '#6c757d', fontSize: 14 }}>
            123 N. Central Ave, Suite 5A<br />
            Karachi, PK 74000
        </div>
    </div>
    <div style={{ flex: 1, minWidth: 220, maxWidth: 330, textAlign: 'left', marginTop: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: 180 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>PRIVACY</div>
        <div style={{ color: '#6c757d', fontSize: 14 }}>
            Terms and Conditions<br />
            Privacy Policy<br />
            Licenses/Use
        </div>
    </div>
    <div style={{ flex: 1, minWidth: 220, maxWidth: 330, textAlign: 'left', marginTop: 16, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: 180 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>ABOUT US</div>
        <div style={{ color: '#6c757d', fontSize: 14 }}>
            Serve-Us is not a marketplace for direct appliance technician deals nor directly offers any appliance products. The advice here can reduce time for consumer resolution with local trusted professionals.<br /><br />
            © {new Date().getFullYear()} Serve-Us. All rights reserved.
        </div>
    </div>
</div>
        </div>
    );
}

export default LandingPage;