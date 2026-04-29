import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {fetchReviews as fetchReviewsApi, deleteReview as deleteReviewApi, updateReview as updateReviewApi} from '../../api/api';

const ReviewList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [updateModal, setUpdateModal] = useState({ visible: false, id: null, review: '' });

  const fetchReviews = async (page = 1, size = 5) => {
    setLoading(true);
    try {
      const res = await fetchReviewsApi(page, size);
      setData(res.data.items);
      setPagination({
        ...pagination,
        current: res.data.page,
        total: res.data.total,
      });
    } catch (error) {
      message.error("Failed to fetch reviews");
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this review?',
      onOk: async () => {
        try {
          await deleteReviewApi(id);
          message.success('Deleted successfully!');
          fetchReviews(pagination.current);
        } catch (error) {
          message.error("Delete failed");
        }
      },
    });
  };

  const columns = [
    { title: 'No', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: 'Book', 
      dataIndex: ['book', 'title'], 
      key: 'book_title' 
    },
    { 
      title: 'Author', 
      render: (_, record) => record.book?.author?.name, // Truy cập 3 cấp Review -> Book -> Author
      key: 'author_name' 
    },
    { 
      title: 'Review', 
      dataIndex: 'review', 
      key: 'review',
      ellipsis: true // Tự động rút gọn nếu nội dung quá dài
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="text" style={{ color: '#1890ff' }} onClick={() => handleUpdate(record.id, record.review)} />
          <Button icon={<DeleteOutlined />} type="text" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleUpdate = (id, review) => {
    setUpdateModal({ visible: true, id, review });
  }

  const handleUpdateOk = async () => {
    try {
      await updateReviewApi(updateModal.id, { review: updateModal.review });
      message.success('Updated successfully!');
      setUpdateModal({ visible: false, id: null, review: '' });
      fetchReviews(pagination.current);
    } catch (error) {
      message.error("Update failed");
    }
  }

  const handleUpdateCancel = () => {
    setUpdateModal({ visible: false, id: null, review: '' });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Reviews List</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ ...pagination, showSizeChanger: false }}
        onChange={(p) => fetchReviews(p.current)}
      />
      <Modal
      title="Update Review"
      open={updateModal.visible}
      onOk={handleUpdateOk}
      onCancel={handleUpdateCancel}
      okText="Update"
      >
        <Input
          value={updateModal.review}
          onChange={(e) => setUpdateModal({ ...updateModal, review: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default ReviewList;