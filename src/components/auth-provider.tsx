'use client';

import type { User, UserRole } from '@/lib/types';
import { users } from '@/lib/data';
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback((role: UserRole) => {
    // Find the first user with the specified role for simulation
    const userToLogin = users.find((u) => u.role === role);
    if (userToLogin) {
      setUser(userToLogin);
      if (userToLogin.role === 'admin') {
        router.push('/dashboard');
      } else if (userToLogin.role === 'consultant') {
        router.push('/consultations');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
