import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {fetchBooks as fetchBooksApi, deleteBook as deleteBookApi, updateBook as updateBookApi} from '../../api/api';

const BookList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [updateModal, setUpdateModal] = useState({ visible: false, id: null, title: ''});

  const fetchBooks = async (page = 1, size = 5) => {
    setLoading(true);
    try {
      const res = await fetchBooksApi(page, size);
      setData(res.data.items);
      setPagination({
        ...pagination,
        current: res.data.page,
        total: res.data.total,
      });
    } catch (error) {
      message.error("Không thể tải danh sách sách");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa cuốn sách này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteBookApi(id);
          message.success('Xóa sách thành công!');
          fetchBooks(pagination.current);
        } catch (error) {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const handleUpdate = (id, title) => {
    setUpdateModal({ visible: true, id, title });
  };

  const handleUpdateOk = async () => {
    try {
        await updateBookApi(updateModal.id, { title: updateModal.title });
        message.success('Cập nhật sách thành công!');
        setUpdateModal({ visible: false, id: null, title: '' });
        fetchBooks(pagination.current);
    } catch (error) {
        message.error("Update failed!");
    }
  };
  
  const handleUpdateCancel = () => {
    setUpdateModal({ visible: false, id: null, title: '' });
  };

  const columns = [
    { title: 'No', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { 
      title: 'Author', 
      dataIndex: ['author', 'name'],
      key: 'author_name' 
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="text" style={{ color: '#1890ff' }} onClick={() => handleUpdate(record.id, record.title)} />
          <Button icon={<DeleteOutlined />} type="text" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Books List</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ ...pagination, showSizeChanger: false }}
        onChange={(p) => fetchBooks(p.current)}
      />
      <Modal
      title="Update Book Title"
      open={updateModal.visible}
      onOk={handleUpdateOk}
      onCancel={handleUpdateCancel}
      okText="Update"
      >
        <Input 
          value={updateModal.title} 
          onChange={(e) => setUpdateModal({ ...updateModal, title: e.target.value })} 
          placeholder="Enter new book title"
        />
      </Modal>
    </div>
  );
};

export default BookList;