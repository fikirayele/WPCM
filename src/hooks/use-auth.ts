'use client';

import { useFirebase, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { User, Consultation, Department, Donation } from '@/lib/types';
import { collection, doc, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';

export function useAuth() {
  const { user: authUser, isUserLoading } = useUser();
  const { firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: user, isLoading: isUserDocLoading } = useDoc<User>(userDocRef);

  const usersCollectionRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'users');
  }, [firestore]);
  const { data: users, isLoading: areUsersLoading } = useCollection<User>(usersCollectionRef);

  const consultationsCollectionRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'consultations');
  }, [firestore]);

  const consultationsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    if (user.role === 'admin') {
      return collection(firestore, 'consultations');
    }
    if (user.role === 'consultant') {
      return query(collection(firestore, 'consultations'), where('consultantId', '==', user.id));
    }
    // Student
    return query(collection(firestore, 'consultations'), where('studentId', '==', user.id));
  }, [firestore, user]);

  const { data: consultations, isLoading: areConsultationsLoading } = useCollection<Consultation>(consultationsQuery);

  const departmentsCollectionRef = useMemoFirebase(() => {
      if(!firestore) return null;
      return collection(firestore, 'departments');
  }, [firestore]);
  const { data: departments, isLoading: areDepartmentsLoading } = useCollection<Department>(departmentsCollectionRef);

  const donationsCollectionRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'donations');
  }, [firestore]);
  const { data: donations, isLoading: areDonationsLoading } = useCollection<Donation>(donationsCollectionRef);
  
  const isLoading = isUserLoading || isUserDocLoading || areUsersLoading || areConsultationsLoading || areDepartmentsLoading || areDonationsLoading;

  return {
    user,
    users: users || [],
    consultations: consultations || [],
    departments: departments || [],
    donations: donations || [],
    isLoaded: !isLoading,
    firestore,
    auth: useFirebase().auth
  };
}
