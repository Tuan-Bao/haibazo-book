import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchAuthors as fetchAuthorsApi, deleteAuthor as deleteAuthorApi, updateAuthor as updateAuthorApi } from '../../api/api';

const AuthorList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [updateModal, setUpdateModal] = useState({ visible: false, id: null, name: '' });

  const fetchAuthors = async (page = 1, size = 5) => {
    setLoading(true);
    try {
      const res = await fetchAuthorsApi(page, size);
      setData(res.data.items);
      setPagination({ ...pagination, current: res.data.page, total: res.data.total });
    } catch (error) {
      message.error("Failed to fetch authors");
    }
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this author?',
      onOk: async () => {
        await deleteAuthorApi(id);
        message.success('Deleted!');
        fetchAuthors(pagination.current);
      },
    });
  };

  const handleUpdate = (id, name) => {
    setUpdateModal({ visible: true, id, name });
  };

  const handleUpdateOk = async () => {
    try {
      await updateAuthorApi(updateModal.id, { name: updateModal.name });
      message.success('Updated!');
      setUpdateModal({ visible: false, id: null, name: '' });
      fetchAuthors(pagination.current);
    } catch (error) {
      message.error('Update failed!');
    }
  };

  const handleUpdateCancel = () => {
    setUpdateModal({ visible: false, id: null, name: '' });
  };

  const columns = [
    { title: 'No', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Books', dataIndex: 'books_count', key: 'books_count' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="text" style={{ color: '#1890ff' }} onClick={() => handleUpdate(record.id, record.name)} />
          <Button icon={<DeleteOutlined />} type="text" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Authors List</h2>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ ...pagination, showSizeChanger: false }}
        onChange={(p) => fetchAuthors(p.current)}
      />
      <Modal
        title="Update Author Name"
        open={updateModal.visible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        okText="Update"
      >
        <Input
          value={updateModal.name}
          onChange={e => setUpdateModal(modal => ({ ...modal, name: e.target.value }))}
          placeholder="Enter new author name"
        />
      </Modal>
    </div>
  );
};

export default AuthorList;