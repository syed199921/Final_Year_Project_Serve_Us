import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Modal, DatePicker, TimePicker, message, Select, Popconfirm, Button, Input, Rate } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const statusColors = {
  confirmed: 'green',
  completed: 'green',
  accepted: 'green',
  pending: 'blue',
  cancelled: 'orange',
  canceled: 'orange',
  rejected: 'red'
};

function Appointment({ customerId, user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editDate, setEditDate] = useState(null);
  const [editTime, setEditTime] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  // Feedback modal state
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackReview, setFeedbackReview] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [appointment, setAppointment] = useState({})

  // Fetch appointments function (for refresh and reuse)
  const fetchAppointments = async () => {
    setLoading(true);
    if (user.role === 'Customer') {
      try {
        const res = await axios.post('http://localhost:5000/appointment/view_customer_appointments', {
          customer: customerId
        });
        setAppointments(res.data.appointments || []);
      } catch (err) {
        setAppointments([]);
      }
    } else if (user.role === 'Technician') {
      try {
        const res = await axios.post('http://localhost:5000/appointment/view_technician_appointments', {
          technician: user.userId
        });
        setAppointments(res.data.appointments || []);
      } catch (err) {
        setAppointments([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [customerId, user.role, user.userId]);

  const handleRemove = async (appointment_id) => {
    try {
      await axios.post('http://localhost:5000/appointment/remove_appointment', { appointment_id });
      message.success('Appointment removed!');
      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      message.error('Failed to remove appointment');
    }
  };

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
    },
    user.role === 'Technician'
        ? {
                title: 'Customer',
                dataIndex: ['customer', 'fullName'],
                key: 'customer',
                render: (_, record) => record.customer?.fullName || '-'
            }
        : {
                title: 'Technician',
                dataIndex: ['technician', 'fullName'],
                key: 'technician',
                render: (_, record) => record.technician?.fullName || '-'
            },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
            <Tag color={statusColors[status?.toLowerCase()] || 'default'}>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Tag>
        ),
    },
    {
        title: 'Edit',
        key: 'edit',
        render: (_, record) => (
            <a
                style={{ color: '#1677ff', marginRight: 8 }}
                onClick={() => {
                    setEditingAppointment(record);
                    setEditDate(record.date ? dayjs(record.date) : null);
                    setEditTime(record.time ? dayjs(record.time, 'HH:mm') : null);
                    setEditStatus(record.status || '');
                    setEditModalVisible(true);
                }}
            >
                <EditOutlined />
            </a>
        )
    },
    {
        title: 'Remove',
        key: 'remove',
        render: (_, record) => (
            <a
                style={{ color: 'red', marginLeft: 8 }}
                onClick={() => handleRemove(record._id)}
            >
                <DeleteOutlined />
            </a>
        )
    }
];

 // Handle feedback modal open after status set to completed
  const handleEditOk = async () => {
    try {
      const res =  await axios.post('http://localhost:5000/appointment/edit_appointment', {
        appointment_id: editingAppointment._id,
        date: editDate ? editDate.format('YYYY-MM-DD') : null,
        time: editTime ? editTime.format('HH:mm') : null,
        status: editStatus
      });
      setAppointment(res.data.appointment);
      setEditModalVisible(false);

      // Only show feedback modal if user is NOT a Technician
      if (editStatus.toLowerCase() === 'completed' && user.role !== 'Technician') {
        setFeedbackTarget(editingAppointment);
        setFeedbackModalVisible(true);
      }

      // Refresh appointments
      await fetchAppointments();
      message.success('Appointment updated!');
    } catch (err) {
      message.error('Failed to update appointment');
    }
  };

  // Handle feedback submit
  const handleFeedbackSubmit = async () => {
    if (!feedbackReview || feedbackRating === 0) {
      message.error('Please provide a review and rating.');
      return;
    }

   
    try {
      await axios.post('http://localhost:5000/feedback/give_feedback', {
        review: feedbackReview,
        rating: feedbackRating * 2, // Each star = 2
        customer: appointment.customer,
        technician: appointment.technician
      });
      setFeedbackModalVisible(false);
      setFeedbackReview('');
      setFeedbackRating(0);
      setFeedbackTarget(null);
      message.success('Feedback submitted!');
    } catch (err) {
      message.error('Failed to submit feedback');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, margin: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, flex: 1 }}>Appointments</Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchAppointments}
          style={{ marginLeft: 12 }}
        >
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey={record => record._id}
          pagination={{ pageSize: 8 }}
        />
      )}
      <Modal
        title="Edit Appointment"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditOk}
        okText="Save"
      >
        <div style={{ marginBottom: 16 }}>
          <span>Date: </span>
          <DatePicker
            value={editDate}
            onChange={date => setEditDate(date)}
            style={{ width: '70%' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <span>Time: </span>
          <TimePicker
            value={editTime}
            onChange={time => setEditTime(time)}
            style={{ width: '70%' }}
            format="HH:mm"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <span>Status: </span>
          <Select
            value={editStatus}
            onChange={value => setEditStatus(value)}
            style={{ width: '70%' }}
          >
            <Option value="pending">Pending</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </div>
      </Modal>
      <Modal
        title="Give Feedback"
        open={feedbackModalVisible}
        onCancel={() => setFeedbackModalVisible(false)}
        onOk={handleFeedbackSubmit}
        okText="Submit"
      >
        <div style={{ marginBottom: 16 }}>
          <span>Review: </span>
          <Input.TextArea
            value={feedbackReview}
            onChange={e => setFeedbackReview(e.target.value)}
            rows={3}
            placeholder="Write your review here..."
          />
        </div>
        <div>
          <span>Rating: </span>
          <Rate
            value={feedbackRating}
            onChange={setFeedbackRating}
            count={5}
            allowClear={false}
            tooltips={['2', '4', '6', '8', '10']}
          />
          <span style={{ marginLeft: 8 }}>{feedbackRating * 2}/10</span>
        </div>
      </Modal>
    </div>
  );
}

export default Appointment;