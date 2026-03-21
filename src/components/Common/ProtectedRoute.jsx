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
    
    // Fallback: If role is defined but not in map, log and go Home
    const targetPath = rolePaths[user.role] || "/";
    console.warn(`Protected Route: Access Denied for role [${user.role}]. Redirecting to [${targetPath}].`);
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
