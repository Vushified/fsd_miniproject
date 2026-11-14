import React, { createContext, useContext, useState, useEffect } from 'react';

// Context for user authentication and role management
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Current active user
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qd_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'usr-1',
          name: 'Vidushi Singh',
          email: 'vidushi@example.com',
          role: 'customer', // customer, vendor, driver, admin
          token: 'mock-jwt-token',
        };
  });

  // Keep local storage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('qd_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qd_user');
    }
  }, [user]);

  // Quick switch role (super helpful for testing all 8 views and viva evaluation)
  const switchRole = (newRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
      name:
        newRole === 'vendor'
          ? 'FreshBasket Vendor'
          : newRole === 'driver'
          ? 'Ramesh Driver'
          : newRole === 'admin'
          ? 'Admin Vidushi'
          : 'Vidushi Singh',
    }));
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'customer', login, logout, switchRole }}>
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

