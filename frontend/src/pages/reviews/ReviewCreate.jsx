import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import {fetchBooks as fetchBooksApi, createReview} from '../../api/api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const ReviewCreate = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetchBooksApi(1, 100);
        setBooks(res.data.items);
      } catch (error) {
        message.error("Failed to load books");
      }
    };
    fetchBooks();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createReview(values);
      message.success('Review created successfully!');
      navigate('/reviews');
    } catch (error) {
      const errorMsg = error.response?.data?.detail?.[0]?.msg || "Something went wrong";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card title="Reviews Create" style={{ width: 600 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Book"
            name="book_id"
            rules={[{ required: true, message: 'Please select book' }]}
          >
            <Select placeholder="Select a book" showSearch filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {books.map(book => (
                <Option key={book.id} value={book.id}>
                  {book.title} ({book.author?.name})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Review"
            name="review"
            rules={[{ required: true, message: 'Please enter review' }]}
          >
            <TextArea rows={6} placeholder="Enter your review here..." />
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

export default ReviewCreate;