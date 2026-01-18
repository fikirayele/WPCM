'use client';

import type { User, Consultation } from '@/lib/types';
import { users as initialUsers, consultations as initialConsultations } from '@/lib/data';
import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => void;
  logout: () => void;
  signup: (userData: Pick<User, 'fullName' | 'email'>, password?: string) => void;
  consultations: Consultation[];
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  addConsultation: (request: Omit<Consultation, 'id' | 'studentId' | 'createdAt' | 'messages' | 'status' | 'fullName' | 'email'>) => void;
  addUser: (userPayload: Omit<User, 'id' | 'avatarUrl'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const router = useRouter();
  const { toast } = useToast();

  // Load state from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('wpcm-users');
      const storedConsultations = localStorage.getItem('wpcm-consultations');
      const storedUser = localStorage.getItem('wpcm-user');

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      if (storedConsultations) {
        setConsultations(JSON.parse(storedConsultations));
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wpcm-users', JSON.stringify(users));
      localStorage.setItem('wpcm-consultations', JSON.stringify(consultations));
      if (user) {
        localStorage.setItem('wpcm-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('wpcm-user');
      }
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [users, consultations, user]);


  const login = useCallback(
    (email: string, password?: string) => {
      const userToLogin = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

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
    [router, toast, users]
  );
  
  const signup = useCallback((userData: Pick<User, 'fullName' | 'email'>, password?: string) => {
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
        toast({
            variant: 'destructive',
            title: 'Signup Failed',
            description: 'An account with this email already exists.',
        });
        return;
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        role: 'student',
        active: true,
    };
    setUsers(prev => [newUser, ...prev]);
    toast({
        title: 'Account Created!',
        description: 'You can now log in with your new account.',
    });
    router.push('/login');
  }, [users, router, toast]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  const updateConsultation = useCallback((id: string, updates: Partial<Consultation>) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);
  
  const addConsultation = useCallback((request: Omit<Consultation, 'id' | 'studentId' | 'createdAt' | 'messages' | 'status' | 'fullName' | 'email'>) => {
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
        status: 'PENDING',
        fullName: user.fullName,
        email: user.email,
        photoUrl: user.avatarUrl,
    };
    setConsultations(prev => [newConsultation, ...prev]);
  }, [user, toast]);

  const addUser = useCallback((userPayload: Omit<User, 'id' | 'avatarUrl'>) => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        ...userPayload,
      };
      setUsers(prev => [...prev, newUser]);
  }, []);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const value = useMemo(() => ({ user, users, login, logout, signup, consultations, updateConsultation, addConsultation, addUser, updateUser, deleteUser }), [user, users, login, logout, signup, consultations, updateConsultation, addConsultation, addUser, updateUser, deleteUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
