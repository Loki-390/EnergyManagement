import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AddData from './pages/AddData';
import HistoryLogs from './pages/HistoryLogs';
import Login from './pages/Login'; // Make sure you created Login.jsx in src/pages/

// Protect Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={<ProtectedRoute><Home /></ProtectedRoute>} 
        />
        <Route 
          path="/add" 
          element={<ProtectedRoute><AddData /></ProtectedRoute>} 
        />
        <Route 
          path="/history" 
          element={<ProtectedRoute><HistoryLogs /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;