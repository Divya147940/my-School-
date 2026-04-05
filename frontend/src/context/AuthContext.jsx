import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('NSGI_AUTH_USER');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('NSGI_AUTH_TOKEN'));

  useEffect(() => {
    if (!token || !user) return;

    // Periodic Session Integrity & Expiry Check
    const checkSession = () => {
        const result = mockApi.verifySession(token);
        if (!result.valid) {
            console.warn(`⛔ SESSION VOID: ${result.error}`);
            logout();
            alert("Your session has expired or been invalidated for security. Please login again.");
        }
    };

    const interval = setInterval(checkSession, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [token, user]);

  const login = (userData, userToken) => {
    // Generate Secure Session Token if one isn't provided (for mock/demo consistency)
    const secureToken = userToken || mockApi.generateSessionToken(userData.id);

    const normalizedUser = userData ? {
        ...userData,
        role: userData.role ? (userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase()) : 'Student'
    } : null;

    setUser(normalizedUser);
    setToken(secureToken);
    localStorage.setItem('NSGI_AUTH_USER', JSON.stringify(normalizedUser));
    localStorage.setItem('NSGI_AUTH_TOKEN', secureToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('NSGI_AUTH_USER');
    localStorage.removeItem('NSGI_AUTH_TOKEN');
  };

  const secureApi = async (url, options = {}) => {
    const currentToken = token || localStorage.getItem('NSGI_AUTH_TOKEN');
    
    // Pre-flight check
    const session = mockApi.verifySession(currentToken);
    if (!session.valid) {
        logout();
        throw new Error("SESSION_EXPIRED");
    }

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
