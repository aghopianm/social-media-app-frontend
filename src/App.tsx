import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Feed from './components/Feed.tsx';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
