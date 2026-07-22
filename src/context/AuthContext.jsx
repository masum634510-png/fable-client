'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('fable_user');
      try {
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = localStorage.getItem('fable_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Verify token is valid by fetching profile
          const res = await fetch(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${parsed.token}` }
          });
          if (res.ok) {
            const profileData = await res.json();
            setUser({ ...parsed, ...profileData, token: parsed.token });
          } else {
            localStorage.removeItem('fable_user');
            setUser(null);
          }
        } catch (err) {
          console.error('Session restore failed', err);
          localStorage.removeItem('fable_user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('fable_user', JSON.stringify(data));
        if (data.role === 'admin') router.push('/dashboard/admin');
        else if (data.role === 'writer') router.push('/dashboard/writer');
        else router.push('/dashboard/user');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      throw err;
    }
  };

  const loginWithGoogle = async (googleData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('fable_user', JSON.stringify(data));
        if (data.role === 'admin') router.push('/dashboard/admin');
        else if (data.role === 'writer') router.push('/dashboard/writer');
        else router.push('/dashboard/user');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('fable_user', JSON.stringify(data));
        router.push('/');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fable_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
