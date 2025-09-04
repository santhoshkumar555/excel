import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import UploadForm from './components/UploadForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';
import Background from './components/Background.jsx';

import './index.css';

function App() {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  const { theme } = useContext(ThemeContext);

  return (
    <Router>
      <Background />
      
      <Navbar />
      
       <main className='bg-transparent'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/upload"
            element={userInfo ? <UploadForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={userInfo ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={userInfo && userInfo.isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/redirect"
            element={
              userInfo 
              ? (userInfo.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/" />)
              : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;