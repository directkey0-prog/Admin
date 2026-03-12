import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin } from '../services/adminService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    const token = localStorage.getItem('admin_token');
    if (stored && token) {
      try { setAdmin(JSON.parse(stored)); } catch { localStorage.removeItem('admin_user'); }
    } else {
      // Clear stale session with no token
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const user = await adminLogin(email, password);
    setAdmin(user);
    localStorage.setItem('admin_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
