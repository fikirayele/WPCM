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
  addConsultation: (request: Omit<Consultation, 'id' | 'studentId' | 'messages' | 'createdAt'>) => void;
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
        } else if (userToLogin.role === 'consultant' || userToLogin.role === 'student') {
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
  
  const addConsultation = useCallback((request: Omit<Consultation, 'id' | 'studentId' | 'messages' | 'createdAt'>) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to make a request.' });
        return;
    };
    const newConsultation: Consultation = {
        ...request,
        id: `cons-${Date.now()}`,
        studentId: user.id,
        createdAt: new Date().toISOString(),
        messages: [],
    };
    setConsultations(prev => [newConsultation, ...prev]);
  }, [user, toast]);

  const value = useMemo(() => ({ user, login, logout, consultations, updateConsultation, addConsultation }), [user, login, logout, consultations, updateConsultation, addConsultation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
