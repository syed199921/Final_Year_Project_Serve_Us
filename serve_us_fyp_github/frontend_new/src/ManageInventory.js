import React, { useEffect, useState } from 'react';
import { Card, Spin, Button, Modal, Form, Input, Select, List, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './ManageInventory.css';

const { Option } = Select;

function ManageInventory({ user }) {
    const [inventory, setInventory] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLowStockModalVisible, setIsLowStockModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchInventory();
    }, [user]);

    const fetchInventory = async () => {
        try {
            const response = await axios.post('http://localhost:5000/inventory/view_items', { technicianId: user.userId });
            setInventory(response.data.inventory || []);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch inventory.');
            console.error('Error fetching inventory:', error);
            setLoading(false);
        }
    };

    const fetchLowStockItems = async () => {
        try {
            const response = await axios.post('http://localhost:5000/inventory/check-low-stock', {
                technicianId: user.userId,
            });
            setLowStockItems(response.data.lowStockItems);
            setIsLowStockModalVisible(true);
        } catch (error) {
            message.error('Failed to fetch low-stock items.');
            console.error(error);
        }
    };

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

    const handleLowStockModalClose = () => {
        setIsLowStockModalVisible(false);
    };

    const handleAddEditInventory = async (values) => {
        try {
            let response;

            if (modalType === 'edit') {
                response = await axios.post("http://localhost:5000/inventory/update_item", {
                    technicianId: user.userId,
                    itemId: selectedItem._id,
                    ...values,
                });
            } else {
                response = await axios.post('http://localhost:5000/inventory/add_item', {
                    ...values,
                    technicianId: user.userId,
                });
            }
            setInventory(response.data.inventory || []);
            setIsModalVisible(false);
        } catch (error) {
            console.error(`Error ${modalType === 'edit' ? 'editing' : 'adding'} inventory:`, error);
        }
    };

    const handleRemoveInventory = async (itemId) => {
        try {
            await axios.post('http://localhost:5000/inventory/remove_item', {
                itemId,
                technicianId: user.userId,
            });
            message.success('Inventory item removed successfully.');
            fetchInventory(); // Refresh inventory after removal
        } catch (error) {
            message.error('Failed to remove inventory item.');
            console.error(error);
        }
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <div className="inventory-container" style={{margin: "2em"}}>
            <Card
                title="Inventory"
                className="inventory-card"
                extra={
                    <div className="card-buttons">
                        <Button type="default" icon={<PlusOutlined />} onClick={() => showModal('add')}>
                            Add Inventory
                        </Button>
                        <Button type="default" onClick={fetchLowStockItems}>
                            Check Low Stock
                        </Button>
                    </div>
                }
            >
                {inventory && inventory.length > 0 ? (
                    <ul>
                        {inventory.map((item, index) => (
                            <li key={index}>
                                <p><strong>Name:</strong> {item.name}</p>
                                <p><strong>Category:</strong> {item.category}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                <p><strong>Low Stock Threshold:</strong> {item.low_stock_threshold}</p>
                                <p><strong>Description:</strong> {item.description}</p>
                                <div className="card-buttons">
                                    <Button type="primary" icon={<EditOutlined />} onClick={() => showModal('edit', item)}>
                                        Edit
                                    </Button>
                                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => handleRemoveInventory(item._id)}>
                                        Remove
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No inventory available. Click "Add Inventory" to add a new item.</p>
                )}
            </Card>

            {/* Modal to display low-stock items */}
            <Modal
                title="Low Stock Items"
                visible={isLowStockModalVisible}
                onCancel={handleLowStockModalClose}
                footer={[
                    <Button key="close" onClick={handleLowStockModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {lowStockItems.length > 0 ? (
                    <List
                        dataSource={lowStockItems}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.name}
                                    description={`Quantity: ${item.quantity}, Low Stock Threshold: ${item.low_stock_threshold}`}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>No low-stock items found.</p>
                )}
            </Modal>

            <Modal
                title={`${modalType === 'edit' ? 'Edit Inventory' : 'Add Inventory'}`}
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleAddEditInventory(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the name of the inventory item!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the category!',
                            },
                        ]}
                    >
                        <Select placeholder="Select a category">
                            <Option value="Tool">Tool</Option>
                            <Option value="Spare Part">Spare Part</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the quantity!',
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="low_stock_threshold"
                        label="Low Stock Threshold"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the low stock threshold!',
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                message: 'Please input the description!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManageInventory;