'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { departments } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { ConsultationActions } from './_components/consultation-actions';

export default function ConsultationsPage() {
  const { consultations, users } = useAuth();
  
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold text-primary">Consultation Management</h1>
            <p className="text-muted-foreground">View and manage all consultation requests.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            Assign consultants to pending requests or view details of ongoing consultations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultationActions
            consultations={consultations}
            users={users}
            departments={departments}
          />
        </CardContent>
      </Card>
    </div>
  );
}
