import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('NSGI_AUTH_USER');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('NSGI_AUTH_TOKEN'));

  const login = (userData, userToken) => {
    // Role Normalization: Always ensure role is Title Case (e.g. 'Student', 'Faculty')
    const normalizedUser = userData ? {
        ...userData,
        role: userData.role ? (userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase()) : 'Student'
    } : null;

    setUser(normalizedUser);
    setToken(userToken);
    localStorage.setItem('NSGI_AUTH_USER', JSON.stringify(normalizedUser));
    localStorage.setItem('NSGI_AUTH_TOKEN', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('NSGI_AUTH_USER');
    localStorage.removeItem('NSGI_AUTH_TOKEN');
  };

  const secureApi = async (url, options = {}) => {
    const currentToken = token || localStorage.getItem('NSGI_AUTH_TOKEN');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${currentToken}`,
      'Content-Type': 'application/json'
    };
    return fetch(url, { ...options, headers });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, secureApi }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
