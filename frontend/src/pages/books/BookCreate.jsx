import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import { createBook, fetchAuthors as fetchAuthorsApi } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const BookCreate = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy danh sách tác giả để đổ vào Select
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        // Lấy size lớn (ví dụ 100) để đảm bảo hiện đủ tác giả trong dropdown
        const res = await fetchAuthorsApi(1, 100);
        setAuthors(res.data.items);
      } catch (error) {
        message.error("Không thể tải danh sách tác giả");
      }
    };
    fetchAuthors();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createBook(values);
      message.success('Tạo sách thành công!');
      navigate('/books');
    } catch (error) {
      // Hiển thị lỗi từ Backend (ví dụ title quá dài hoặc trống)
      const errorMsg = error.response?.data?.detail?.[0]?.msg || "Có lỗi xảy ra";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card title="Books Create" style={{ width: 600 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="Nhập tên sách" />
          </Form.Item>

          <Form.Item
            label="Author"
            name="author_id"
            rules={[{ required: true, message: 'Please select author' }]}
          >
            <Select placeholder="Chọn tác giả" showSearch filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {authors.map(author => (
                <Option key={author.id} value={author.id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BookCreate;