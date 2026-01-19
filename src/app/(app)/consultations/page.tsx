'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { departments } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { ConsultationActions } from './_components/consultation-actions';
import { useMemo } from 'react';

export default function ConsultationsPage() {
  const { user, consultations, users } = useAuth();
  
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
    : 'Track the progress of your consultation requests below.';
  
  const cardTitle = user?.role === 'admin' ? 'All Requests' : 'My Requests';
  const cardDescription = user?.role === 'admin' 
    ? 'Assign consultants to pending requests or view details of ongoing consultations.'
    : 'You can view the details and status of each request you have made.';

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
