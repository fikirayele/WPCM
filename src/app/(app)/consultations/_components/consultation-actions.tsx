'use client';

import React from 'react';
import type { Consultation, User, Department } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Eye, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ConsultationActionsProps {
  consultations: Consultation[];
  users: User[];
  departments: Department[];
}

export function ConsultationActions({ consultations, users, departments }: ConsultationActionsProps) {
  const router = useRouter();
  const { user } = useAuth();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PENDING': return 'destructive';
      case 'AWAITING_ACCEPTANCE':
      case 'ASSIGNED': return 'secondary';
      case 'PAUSED': return 'outline';
      case 'COMPLETED': return 'outline';
      default: return 'secondary';
    }
  };

  const handleRowClick = (consultationId: string) => {
    router.push(`/consultations/${consultationId}`);
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations.map((c) => {
          const student = users.find(u => u.id === c.studentId);
          const department = departments.find(d => d.id === c.departmentId);

          return (
            <TableRow key={c.id} className="cursor-pointer" onClick={() => handleRowClick(c.id)}>
              <TableCell>{c.fullName || student?.fullName || 'N/A'}</TableCell>
              <TableCell>{department?.name || 'N/A'}</TableCell>
              <TableCell>{format(new Date(c.createdAt), 'PP')}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(c.status)}>{c.status.replace(/_/g, ' ')}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {user?.role === 'admin' && c.status === 'PENDING' ? (
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRowClick(c.id)}}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleRowClick(c.id); }}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
