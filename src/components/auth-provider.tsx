'use client';

import type { User, Consultation } from '@/lib/types';
import { users, consultations as initialConsultations } from '@/lib/data';
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  logout: () => void;
  consultations: Consultation[];
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const router = useRouter();
  const { toast } = useToast();

  const login = useCallback(
    (email: string, password?: string) => {
      // Find user by email. For demo, we ignore password.
      const userToLogin = users.find((u) => u.email === email);

      if (userToLogin) {
        if (!userToLogin.active) {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Your account is inactive. Please contact an administrator.',
          });
          return;
        }
        setUser(userToLogin);
        if (userToLogin.role === 'admin') {
          router.push('/dashboard');
        } else if (userToLogin.role === 'consultant') {
          router.push('/consultations');
        } else {
          router.push('/');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid email or password.',
        });
      }
    },
    [router, toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  const updateConsultation = useCallback((id: string, updates: Partial<Consultation>) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const value = useMemo(() => ({ user, login, logout, consultations, updateConsultation }), [user, login, logout, consultations, updateConsultation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
