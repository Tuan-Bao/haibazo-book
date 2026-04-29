import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import AuthorList from './pages/authors/AuthorList';
import AuthorCreate from './pages/authors/AuthorCreate';
import BookList from './pages/books/BookList';
import BookCreate from './pages/books/BookCreate';
import ReviewList from './pages/reviews/ReviewList';
import ReviewCreate from './pages/reviews/ReviewCreate';

const { Content, Header } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />

        <Layout>
          <Header style={{ 
            background: '#333', 
            padding: '0 24px', 
            color: '#fff', 
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            HAIBAZO BOOK REVIEW
          </Header>

          <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/authors" />} />
              
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/authors/create" element={<AuthorCreate />} />

              <Route path="/books" element={<BookList />} />
              <Route path="/books/create" element={<BookCreate />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/reviews/create" element={<ReviewCreate />} />
              
              <Route path="*" element={<div style={{ padding: 20 }}>404 - Not Found</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;