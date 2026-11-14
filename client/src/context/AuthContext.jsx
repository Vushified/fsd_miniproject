import React, { createContext, useContext, useState, useEffect } from 'react';

// Context for user authentication, JWT tokens, and Role-Based Access Control (RBAC)
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Read authenticated user & JWT token from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qd_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('qd_token') || null;
  });

  // Keep local storage in sync
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('qd_user', JSON.stringify(user));
      localStorage.setItem('qd_token', token);
    } else {
      localStorage.removeItem('qd_user');
      localStorage.removeItem('qd_token');
    }
  }, [user, token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken || userData.token || 'mock-jwt-token');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('qd_user');
    localStorage.removeItem('qd_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
