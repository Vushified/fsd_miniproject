import React, { createContext, useContext, useState, useEffect } from 'react';

// Context for user authentication, JWT tokens, and Role-Based Access Control (RBAC)
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Preset accounts for the 4 roles
  const accounts = {
    customer: {
      id: 'usr-customer',
      name: 'Vidushi Singh',
      email: 'vidushi@example.com',
      role: 'customer',
      token: 'jwt-token-customer-2026',
    },
    vendor: {
      id: 'usr-vendor',
      name: 'FreshBasket Vendor',
      email: 'vendor@example.com',
      role: 'vendor',
      token: 'jwt-token-vendor-2026',
    },
    driver: {
      id: 'usr-driver',
      name: 'Ramesh Sharma',
      email: 'driver@example.com',
      role: 'driver',
      token: 'jwt-token-driver-2026',
    },
    admin: {
      id: 'usr-admin',
      name: 'System Admin (Vidushi)',
      email: 'admin@example.com',
      role: 'admin',
      token: 'jwt-token-admin-2026',
    },
  };

  // Read saved user or default to Customer
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qd_user');
      return saved ? JSON.parse(saved) : accounts.customer;
    } catch {
      return accounts.customer;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('qd_token') || 'jwt-token-customer-2026';
  });

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('qd_user', JSON.stringify(user));
      localStorage.setItem('qd_token', user.token || token || 'jwt-token-2026');
    } else {
      localStorage.removeItem('qd_user');
      localStorage.removeItem('qd_token');
    }
  }, [user, token]);

  const login = (userData, jwtToken) => {
    const userWithToken = {
      ...userData,
      token: jwtToken || userData.token || 'jwt-token-2026',
    };
    setUser(userWithToken);
    setToken(userWithToken.token);
  };

  // Quick switch role / account (essential for two-window demo & viva evaluation)
  const switchRole = (newRole) => {
    const selected = accounts[newRole] || accounts.customer;
    setUser(selected);
    setToken(selected.token);
  };

  const logout = () => {
    // Return to guest customer
    setUser(null);
    setToken(null);
    localStorage.removeItem('qd_user');
    localStorage.removeItem('qd_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || token,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
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
