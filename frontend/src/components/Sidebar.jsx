import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, BookOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'authors',
      icon: <UserOutlined />,
      label: 'Authors',
      children: [
        { key: '/authors', label: 'List' },
        { key: '/authors/create', label: 'Create' },
      ],
    },
    {
      key: 'books',
      icon: <BookOutlined />,
      label: 'Books',
      children: [
        { key: '/books', label: 'List' },
        { key: '/books/create', label: 'Create' },
      ],
    },
    {
      key: 'reviews',
      icon: <CommentOutlined />,
      label: 'Reviews',
      children: [
        { key: '/reviews', label: 'List' },
        { key: '/reviews/create', label: 'Create' },
      ],
    },
  ];

  return (
    <Sider width={250} theme="light" style={{ height: '100vh', borderRight: '1px solid #f0f0f0' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 }}>
        HAIBAZO
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['authors']}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;