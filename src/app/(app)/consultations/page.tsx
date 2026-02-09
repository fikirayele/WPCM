'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { ConsultationActions } from './_components/consultation-actions';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConsultationsPage() {
  const { user, consultations, users, departments, isLoaded } = useAuth();
  
  const filteredConsultations = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') {
        return consultations;
    }
    if (user.role === 'consultant') {
        return consultations.filter(c => c.consultantId === user.id);
    }
    return consultations.filter(c => c.studentId === user.id);
  }, [user, consultations]);

  const pageTitle = user?.role === 'admin' ? 'Consultation Management' : 'My Consultations';
  const pageDescription = user?.role === 'admin' 
    ? 'View and manage all consultation requests.'
    : user?.role === 'consultant'
    ? 'View and manage all consultations assigned to you.'
    : 'Track the progress of your consultation requests below.';
  
  const cardTitle = user?.role === 'admin' 
    ? 'All Requests' 
    : user?.role === 'consultant'
    ? 'Assigned to You'
    : 'My Requests';
  const cardDescription = user?.role === 'admin' 
    ? 'Assign consultants to pending requests or view details of ongoing consultations.'
    : user?.role === 'consultant'
    ? 'These are the consultation requests assigned to you. Select one to view details and begin the conversation.'
    : 'You can view the details and status of each request you have made.';

  if (!isLoaded) {
    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <Skeleton className="h-9 w-72 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full max-w-lg" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 pt-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold text-primary">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultationActions
            consultations={filteredConsultations}
            users={users}
            departments={departments}
          />
        </CardContent>
      </Card>
    </div>
  );
}

    