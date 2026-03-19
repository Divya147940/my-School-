import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard based on role
    const rolePaths = {
      'Admin': '/admin-dashboard',
      'Faculty': '/faculty-dashboard',
      'Student': '/student-dashboard',
      'Parent': '/parent-dashboard'
    };
    return <Navigate to={rolePaths[user.role] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
