import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { createAuthor } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const AuthorCreate = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await createAuthor(values);
      message.success('Author created successfully!');
      navigate('/authors');
    } catch (error) {
      message.error(error.response?.data?.detail?.[0]?.msg || 'Validation Error');
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card title="Authors Create" style={{ width: 500 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter author name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AuthorCreate;