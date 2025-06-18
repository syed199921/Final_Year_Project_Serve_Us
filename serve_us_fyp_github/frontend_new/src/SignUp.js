import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        role: 'Customer',
        technicianType: '',
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
            const response = await axios.post('http://localhost:5000/user/signup', formData);
           
            console.log('Sign-up successful:', response.data);
            navigate('/');
        } catch (error) {
           
            navigate('/');
            console.error('Sign-up error:', error);
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
                            objectFit: 'fill'
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
                    <h2 style={{ fontWeight: 700, marginBottom: 8, color: 'rgb(22, 119, 255)' }}>Welcome!</h2>
                    <div style={{ fontSize: 15, marginBottom: 18 }}>
                        <span>
                            <b>
                                <Link to="/signup" style={{ color: '#23272f', textDecoration: 'underline' }}>Create a free account</Link>
                            </b>
                        </span>
                        <span style={{ color: '#888' }}> or log in to get started using Serve-Us</span>
                    </div>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {/* Full Name and Date of Birth side by side */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="fullName" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    style={{
                                        width: '80%',
                                        padding: '12px 16px',
                                        borderRadius: 24,
                                        border: '1px solid #bbb',
                                        fontSize: 16,
                                        background: '#fff',
                                        outline: 'none',
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="dateOfBirth" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    style={{
                                        width: '80%',
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
                        </div>
                        {/* Role and Contact Number side by side */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="role" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: 24,
                                        border: '1px solid #bbb',
                                        fontSize: 16,
                                        background: '#fff',
                                        outline: 'none'
                                    }}
                                    required
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Technician">Technician</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="contactNumber" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Contact Number</label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="Enter your contact number"
                                    style={{
                                        width: '80%',
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
                        </div>
                        {formData.role === 'Technician' && (
                            <div style={{ marginBottom: 18 }}>
                                <label htmlFor="technicianType" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Technician Type</label>
                                <select
                                    id="technicianType"
                                    name="technicianType"
                                    value={formData.technicianType}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: 24,
                                        border: '1px solid #bbb',
                                        fontSize: 16,
                                        background: '#fff',
                                        outline: 'none'
                                    }}
                                    required
                                >
                                    <option value="Electrician">Electrician</option>
                                </select>
                            </div>
                        )}
                        {/* Password */}
                        <div style={{ marginBottom: 8 }}>
                            <label htmlFor="password" style={{ display: 'block', fontWeight: 500, marginBottom: 4, textAlign: 'left' }}>Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
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
                            Sign Up
                        </button>
                    </form>
                    <p style={{ marginTop: 18, textAlign: 'center', color: '#444' }}>
                        Already have an account? <Link to="/">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;