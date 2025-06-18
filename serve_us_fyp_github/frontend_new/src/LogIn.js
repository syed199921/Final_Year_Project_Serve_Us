import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

function LogIn() {
    const [technicianName, setTechnicianName] = useState('');
    const [formData, setFormData] = useState({
        contactNumber: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/login', formData);
            if (response.status === 200) {
                const user = response.data.user;
                if (user.role === 'Customer') {
                    navigate('/chatbot', { state: { user } });
                } else if (user.role === 'Technician') {
                    const technicianResponse = await axios.post('http://localhost:5000/technician/get_technician', { id: user.userId });
                    const technicianName = technicianResponse.data.technician.fullName;
                    setTechnicianName(technicianName);
                    navigate('/dashboard', { state: { user, technicianName } });
                } else {
                    window.alert('Unknown user role.');
                }
            } else {
                window.alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            window.alert('An error occurred during login.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f7fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                maxWidth: 900,
                width: '100%',
                display: 'flex',
                overflow: 'hidden',
                minHeight: 540
            }}>
                {/* Left Side - Image/Pattern */}
                <div style={{
                    flex: 1.1,
                    background: '#f7fafd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 320,
                    minHeight: 400
                }}>
                    <img
                        src="tools+chat.jpg"
                        alt="Pattern"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 18,
                            objectFit: 'cover'
                        }}
                    />
                </div>
                {/* Right Side - Form */}
                <div style={{
                    flex: 1,
                    padding: '48px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minWidth: 320
                }}>
                    <Link to="/" style={{ color: '#222', fontSize: 15, marginBottom: 18, textDecoration: 'none', display: 'inline-block' }}>
                        &lt; Back to website
                    </Link>
                    <h2 style={{ fontWeight: 700, marginBottom: 8 , color: 'rgb(22, 119, 255)'}}>Welcome!</h2>
                    <div style={{ fontSize: 15, marginBottom: 18 }}>
                        <span>
                            <b>
                                <Link to="/signup" style={{ color: '#23272f', textDecoration: 'underline' }}>Create a free account</Link>
                            </b>
                        </span>
                        <span style={{ color: '#888' }}> or log in to get started using Serve-Us</span>
                    </div>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="contactNumber" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                id="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Email"
                                style={{
                                    width: '90%',
                                    padding: '12px 16px',
                                    borderRadius: 24,
                                    border: '1px solid #bbb',
                                    fontSize: 16,
                                    background: '#fff',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <label htmlFor="password" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                style={{
                                    width: '90%',
                                    padding: '12px 16px',
                                    borderRadius: 24,
                                    border: '1px solid #bbb',
                                    fontSize: 16,
                                    background: '#fff',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                background: 'rgb(22, 119, 255)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 24,
                                padding: '13px 0',
                                fontSize: 17,
                                fontWeight: 600,
                                margin: '0 0 18px 0',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                marginTop: 16
                            }}
                        >
                            Log in
                        </button>
                    </form>
                    
                </div>
            </div>
        </div>
    );
}

export default LogIn;