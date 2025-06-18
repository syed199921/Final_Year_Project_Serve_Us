import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import axios from 'axios';
import './TechnicianDetails.css';

function TechnicianDetails({ user }) {
    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechnicianDetails = async () => {
            console.log("user", user);
            try {
                const response = await axios.post('http://localhost:5000/technician/get_technician', { id: user.userId });
                console.log(response);
                setTechnician(response.data.technician);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching technician details:', error);
                setLoading(false);
            }
        };

        if (user && user.userId) {
            fetchTechnicianDetails();
        }
    }, [user]);

    if (loading) {
        return <Spin />;
    }

    if (!technician) {
        return <p>No technician details available.</p>;
    }

    return (
        <Card title="Technician Details" className="technician-details-card">
        <div>
            <p><strong>Name:</strong> {technician.fullName}</p>
            <p><strong>Technician Type:</strong> {technician.technicianType}</p>
            <p><strong>Date of Birth:</strong> {new Date(technician.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Contact Number:</strong> {technician.contactNumber}</p>
            <p><strong>Location:</strong> {user.location}</p>
        </div>
    </Card>
    );
}

export default TechnicianDetails;