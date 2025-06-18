import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ManagePortfolio.css';

function ManagePortfolio({ user }) {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // To differentiate between Professional Summary, Projects, and Services
    const [selectedItem, setSelectedItem] = useState(null); // For editing specific projects or services
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchPortfolioDetails = async () => {
            try {
                const response = await axios.post('http://localhost:5000/portfolio/view_portfolio', { technician_id: user.userId });
                setPortfolio(response.data.portfolio);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching portfolio details:', error);
                setLoading(false);
            }
        };

        if (user && user.userId) {
            fetchPortfolioDetails();
        }
    }, [user]);

    const showModal = (type, item = null) => {
        setModalType(type);
        setSelectedItem(item);
        setIsModalVisible(true);
        if (item) {
            form.setFieldsValue(item);
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedItem(null);
    };

    const handleAddEdit = async (values) => {
        try {
            let response;
            if (modalType === 'professionalSummary') {
                // Adding or editing the professional summary
                response = await axios.post('http://localhost:5000/portfolio/add_professional_summary', {
                    professionalSummary: values.professionalSummary,
                    technicianId: user.userId,
                });
            } else if (modalType === 'projects') {
                if (selectedItem) {
                    // Editing a project
                    response = await axios.post('http://localhost:5000/portfolio/edit_project', {
                        projectId: selectedItem._id,
                        title: values.title,
                        description: values.description,
                        technicianId: user.userId,
                    });
                } else {
                    // Adding a project
                    response = await axios.post('http://localhost:5000/portfolio/add_project', {
                        title: values.title,
                        description: values.description,
                        technicianId: user.userId,
                    });
                }
            } else if (modalType === 'services') {
                if (selectedItem) {
                    // Editing a service
                    response = await axios.post('http://localhost:5000/portfolio/edit_service', {
                        serviceId: selectedItem._id,
                        title: values.title,
                        description: values.description,
                        pricing: values.pricing,
                        technicianId: user.userId,
                    });
                } else {
                    // Adding a service
                    response = await axios.post('http://localhost:5000/portfolio/add_service', {
                        title: values.title,
                        description: values.description,
                        pricing: values.pricing,
                        technicianId: user.userId,
                    });
                }
            }
            console.log(response);
            setPortfolio(response.data.portfolio); // Update the portfolio state
            setIsModalVisible(false);
        } catch (error) {
            console.error(`Error adding/editing ${modalType}:`, error);
        }
    };

    const handleRemove = async (type, itemId) => {
        try {
            let response;
            if (type === 'projects') {
                response = await axios.post('http://localhost:5000/portfolio/remove_project', {
                    projectId: itemId,
                    technicianId: user.userId,
                });
            } else if (type === 'services') {
                response = await axios.post('http://localhost:5000/portfolio/remove_service', {
                    serviceId: itemId,
                    technicianId: user.userId,
                });
            }
            setPortfolio(response.data.portfolio);
        } catch (error) {
            console.error(`Error removing ${type}:`, error);
        }
    };

    if (loading) {
        return <Spin />;
    }

    if (!portfolio) {
        return <p>No portfolio details available.</p>;
    }

    return (
        <div className="portfolio-container">
            {/* Professional Summary Card */}
            <Card
                title="Professional Summary"
                className="portfolio-card"
                extra={
                    <div className="card-buttons">
                        {portfolio.professionalSummary ? (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => showModal('professionalSummary')}
                            >
                                Edit
                            </Button>
                        ) : (
                            <Button
                                type="default"
                                icon={<PlusOutlined />}
                                onClick={() => showModal('professionalSummary')}
                            >
                                Add
                            </Button>
                        )}
                    </div>
                }
            >
                <p>{portfolio.professionalSummary || 'Add professional summary.'}</p>
            </Card>

{/* Projects Card */}
<Card
    title="Projects"
    className="portfolio-card"
    extra={
        <div className="card-buttons">
            <Button type="default" icon={<PlusOutlined />} onClick={() => showModal('projects')}>Add</Button>
        </div>
    }
>
    {portfolio.projects.length > 0 ? (
        <ul>
            {portfolio.projects.map((project, index) => (
                <li key={index}>
                    <p><strong>Title:</strong> {project.title}</p>
                    <p><strong>Description:</strong> {project.description}</p>
                    <div className="card-buttons">
                        <Button type="primary" icon={<EditOutlined />} onClick={() => showModal('projects', project)}>Edit</Button>
                        <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleRemove('projects', project._id)}>Remove</Button>
                    </div>
                </li>
            ))}
        </ul>
    ) : (
        <p>No projects available. Click "Add" to add a new project.</p>
    )}
</Card>

{/* Services Card */}
<Card
    title="Services"
    className="portfolio-card"
    extra={
        <div className="card-buttons">
            <Button type="default" icon={<PlusOutlined />} onClick={() => showModal('services')}>Add</Button>
        </div>
    }
>
    {portfolio.services.length > 0 ? (
        <ul>
            {portfolio.services.map((service, index) => (
                <li key={index}>
                    <p><strong>Title:</strong> {service.title}</p>
                    <p><strong>Description:</strong> {service.description}</p>
                    <p><strong>Pricing Per Hour:</strong> Rs {service.pricing}</p>
                    <div className="card-buttons">
                        <Button type="primary" icon={<EditOutlined />} onClick={() => showModal('services', service)}>Edit</Button>
                        <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleRemove('services', service._id)}>Remove</Button>
                    </div>
                </li>
            ))}
        </ul>
    ) : (
        <p>No services available. Click "Add" to add a new service.</p>
    )}
</Card>

            {/* Modal for Add/Edit */}
            <Modal
                title={`Edit ${modalType === 'professionalSummary' ? 'Professional Summary' : modalType === 'projects' ? 'Project' : 'Service'}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleAddEdit(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    {modalType === 'professionalSummary' && (
                        <Form.Item
                            name="professionalSummary"
                            label="Professional Summary"
                            initialValue={portfolio.professionalSummary}
                            rules={[
                                {
                                    message: 'Please input the professional summary!',
                                },
                            ]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    )}
                    {(modalType === 'projects' || modalType === 'services') && (
                        <>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input the title!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input the description!',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            {modalType === 'projects' && (
                                <>
                                   
                                </>
                            )}
                            {modalType === 'services' && (
                                <Form.Item
                                    name="pricing"
                                    label="Pricing"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input the pricing!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
}

export default ManagePortfolio;