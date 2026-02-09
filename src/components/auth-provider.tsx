'use client';

import type { User, Consultation, Donation } from '@/lib/types';
import { users as initialUsers, consultations as initialConsultations, donations as initialDonations } from '@/lib/data';
import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => void;
  logout: () => void;
  signup: (userData: Pick<User, 'fullName' | 'email'>, password?: string) => void;
  consultations: Consultation[];
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  addConsultation: (request: Omit<Consultation, 'id' | 'studentId' | 'createdAt' | 'messages' | 'status' | 'fullName' | 'email'>) => void;
  acceptConsultation: (consultationId: string, userId: string) => void;
  addUser: (userPayload: Omit<User, 'id' | 'avatarUrl'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  donations: Donation[];
  addDonation: (donationData: Omit<Donation, 'id' | 'date'>) => void;
  isLoaded: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const getInitialState = <T,>(storageKey: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    try {
        const storedItem = localStorage.getItem(storageKey);
        // Prevent demo data from overwriting existing data
        if (storedItem) {
          return JSON.parse(storedItem);
        }
        localStorage.setItem(storageKey, JSON.stringify(fallback));
        return fallback;
    } catch (error) {
        console.error(`Failed to load ${storageKey} from localStorage`, error);
        return fallback;
    }
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getInitialState('wpcm-user', null));
  const [users, setUsers] = useState<User[]>(() => getInitialState('wpcm-users', initialUsers));
  const [consultations, setConsultations] = useState<Consultation[]>(() => getInitialState('wpcm-consultations', initialConsultations));
  const [donations, setDonations] = useState<Donation[]>(() => getInitialState('wpcm-donations', initialDonations));
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('wpcm-users', JSON.stringify(users));
      localStorage.setItem('wpcm-consultations', JSON.stringify(consultations));
      localStorage.setItem('wpcm-donations', JSON.stringify(donations));
      if (user) {
        localStorage.setItem('wpcm-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('wpcm-user');
      }
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [users, consultations, user, donations, isLoaded]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || !event.newValue) return;

      try {
        if (event.key === 'wpcm-user') {
          setUser(JSON.parse(event.newValue));
        } else if (event.key === 'wpcm-users') {
          setUsers(JSON.parse(event.newValue));
        } else if (event.key === 'wpcm-consultations') {
          setConsultations(JSON.parse(event.newValue));
        } else if (event.key === 'wpcm-donations') {
          setDonations(JSON.parse(event.newValue));
        }
      } catch (error) {
        console.error('Error parsing storage event data', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


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
    [router, users]
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
  }, [users, router]);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  const updateConsultation = useCallback((id: string, updates: Partial<Consultation>) => {
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const acceptConsultation = useCallback((consultationId: string, userId: string) => {
    setConsultations(prevConsultations => {
        const targetConsultation = prevConsultations.find(c => c.id === consultationId);
        if (!targetConsultation) return prevConsultations;

        const isStudentAction = targetConsultation.studentId === userId;
        
        const studentAccepted = isStudentAction ? true : targetConsultation.studentAccepted;
        const consultantAccepted = !isStudentAction ? true : targetConsultation.consultantAccepted;

        const becomesActive = studentAccepted && consultantAccepted;
        const status = becomesActive ? 'ACTIVE' : targetConsultation.status;
        
        if (becomesActive) {
            setTimeout(() => toast({ title: "Consultation Active", description: "You can now start chatting." }), 0);
        } else {
            setTimeout(() => toast({ title: "Accepted!", description: `You have accepted. Waiting for the other party.` }), 0);
        }

        return prevConsultations.map(c => 
            c.id === consultationId ? { ...c, studentAccepted, consultantAccepted, status } : c
        );
    });
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
  }, [user]);

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

  const addDonation = useCallback((donationData: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Donation = {
        ...donationData,
        id: `don-${Date.now()}`,
        date: new Date().toISOString(),
    };
    setDonations(prev => [newDonation, ...prev]);
  }, []);

  const value = useMemo(() => ({ user, users, login, logout, signup, consultations, updateConsultation, addConsultation, acceptConsultation, addUser, updateUser, deleteUser, donations, addDonation, isLoaded }), [user, users, login, logout, signup, consultations, updateConsultation, addConsultation, acceptConsultation, addUser, updateUser, deleteUser, donations, addDonation, isLoaded]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
