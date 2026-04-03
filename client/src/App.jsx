import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AddData from './pages/AddData';
import HistoryLogs from './pages/HistoryLogs';
import Login from './pages/Login';

// --- Improved Protected Route ---
const ProtectedRoute = ({ children }) => {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // If not logged in, send them to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page
  return children;
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
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/add" 
          element={
            <ProtectedRoute>
              <AddData />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <HistoryLogs />
            </ProtectedRoute>
          } 
        />

        {/* Fallback: Redirect any unknown URL to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;