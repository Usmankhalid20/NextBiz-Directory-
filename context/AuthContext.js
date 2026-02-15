'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch('/api/auth/me'); // Call internal API to verify cookie
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async ({ email, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.user);
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
    
    return data;
  };

  // Signup
  const signup = async ({ name, email, password }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    return data;
  };

  // Logout
  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
