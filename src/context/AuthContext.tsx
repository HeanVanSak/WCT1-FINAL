import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import {
  subscribeAuth,
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
  updateUserProfile,
  setAdminRole
} from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (name: string, email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  promoteToAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeAuth((userProfile) => {
      setUser(userProfile);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const profile = await loginUser(email, pass);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const profile = await registerUser(name, email, pass);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    await resetPassword(email);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No logged in user.');
    const updated = await updateUserProfile(user.uid, data);
    setUser(updated);
    return updated;
  };

  const promoteToAdmin = async () => {
    if (!user) return;
    await setAdminRole(user.uid);
    const updated = await updateUserProfile(user.uid, { role: 'admin' });
    setUser(updated);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        promoteToAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
