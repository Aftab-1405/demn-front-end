import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { authAPI } from '../services/api';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken, removeToken] = useLocalStorage('token', null);
  // Initialize loading based on token presence
  const [loading, setLoading] = useState(!!token);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, [removeToken]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentUser]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }, [setToken]);

  const register = useCallback(async (data) => {
    try {
      const response = await authAPI.register(data);
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }, [setToken]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }), [user, token, loading, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};