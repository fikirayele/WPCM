'use client';

import React, { useState } from 'react';
import type { Consultation, User, Department } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

interface ConsultationActionsProps {
  initialConsultations: Consultation[];
  users: User[];
  departments: Department[];
}

export function ConsultationActions({ initialConsultations, users, departments }: ConsultationActionsProps) {
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PENDING': return 'destructive';
      case 'ASSIGNED': return 'secondary';
      case 'PAUSED': return 'outline';
      case 'COMPLETED': return 'outline';
      default: return 'secondary';
    }
  };

  const handleAssign = (consultationId: string) => {
    if (!selectedConsultant) {
      toast({ title: "Error", description: "Please select a consultant.", variant: "destructive" });
      return;
    }

    setConsultations(consultations.map(c => 
      c.id === consultationId ? { ...c, status: 'ASSIGNED', consultantId: selectedConsultant } : c
    ));
    
    const consultant = users.find(u => u.id === selectedConsultant);
    toast({ title: "Consultant Assigned", description: `${consultant?.name} has been assigned.` });

    // Close the dialog - this is tricky without controlling open state from here.
    // In a real app, dialog open state would be managed here.
    setSelectedConsultant(null);
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
          const availableConsultants = users.filter(u => u.role === 'consultant' && u.departmentId === c.departmentId);

          return (
            <TableRow key={c.id} className="cursor-pointer" onClick={() => handleRowClick(c.id)}>
              <TableCell>{student?.name || 'N/A'}</TableCell>
              <TableCell>{department?.name || 'N/A'}</TableCell>
              <TableCell>{format(new Date(c.createdAt), 'PP')}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {c.status === 'PENDING' ? (
                  <Dialog onOpenChange={() => setSelectedConsultant(null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={(e) => e.stopPropagation()}>Assign</Button>
                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                      <DialogHeader>
                        <DialogTitle>Assign Consultant</DialogTitle>
                        <DialogDescription>Select a consultant from the {department?.name} department.</DialogDescription>
                      </DialogHeader>
                      <Select onValueChange={setSelectedConsultant}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a consultant" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableConsultants.map(consultant => (
                            <SelectItem key={consultant.id} value={consultant.id}>{consultant.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <DialogFooter>
                        <Button onClick={() => handleAssign(c.id)}>Assign</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRowClick(c.id); }}>
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
