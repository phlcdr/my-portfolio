import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ authenticated: true });
    } else {
      localStorage.removeItem('admin_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);

    // Global interceptor to auto-logout on 401 Unauthorized
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('admin_token');
          delete axios.defaults.headers.common['Authorization'];
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const login = async (username, password) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const res = await axios.post(`${apiUrl}/auth/login`, { username, password });
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
