'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { IUser, IApiResponse, IAuthContext } from '@/types';
import { API_ROUTES, ROUTES } from '@/lib/constants';

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    try {
      const res = await fetch(API_ROUTES.AUTH_ME);
      const data: IApiResponse<{ user: IUser }> = await res.json();
      
      if (data.success && data.data) {
        // API response wrapper might assume data.user based on old structure, adjustment needed:
        // Checking old 'me' route, it returned { success: true, user: ... }
        // Let's assume standardized response or handle both
        // @ts-ignore - Temporary fix until API route is refactored to standard IApiResponse
        setUser(data.user || data.data);
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
  const login = async (credentials: { email: string; password: string }) => {
    const res = await fetch(API_ROUTES.AUTH_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.user);
      if (data.user.role === 'admin') {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    }
    
    return data;
  };

  // Signup
  const signup = async (userData: { name: string; email: string; password: string }) => {
    const res = await fetch(API_ROUTES.AUTH_SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    return data;
  };

  // Logout
  const logout = async () => {
    await fetch(API_ROUTES.AUTH_LOGOUT, {
      method: 'POST',
    });
    setUser(null);
    router.push(ROUTES.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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
