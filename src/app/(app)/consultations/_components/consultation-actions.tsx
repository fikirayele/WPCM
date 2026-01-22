'use client';

import React, { useState } from 'react';
import type { Consultation, User, Department } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentConsultationId, setCurrentConsultationId] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { updateConsultation, user } = useAuth();

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

  const handleAssign = () => {
    if (!selectedConsultant || !currentConsultationId) {
      toast({ title: "Error", description: "Please select a consultant.", variant: "destructive" });
      return;
    }
    
    updateConsultation(currentConsultationId, {
        status: 'AWAITING_ACCEPTANCE',
        consultantId: selectedConsultant,
        studentAccepted: false,
        consultantAccepted: false
    });
    
    const consultant = users.find(u => u.id === selectedConsultant);
    toast({ title: "Consultant Assigned", description: `${consultant?.fullName} has been assigned. A notification has been sent to the student and the consultant.` });
    
    setIsDialogOpen(false);
    setSelectedConsultant(null);
    setCurrentConsultationId(null);
  };
  
  const handleRowClick = (consultationId: string) => {
    router.push(`/consultations/${consultationId}`);
  };
  
  const openAssignDialog = (e: React.MouseEvent, consultationId: string) => {
    e.stopPropagation();
    setCurrentConsultationId(consultationId);
    setIsDialogOpen(true);
  }

  return (
    <>
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
                      <Button size="sm" onClick={(e) => openAssignDialog(e, c.id)}>
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
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) {
              setSelectedConsultant(null);
              setCurrentConsultationId(null);
          }
          setIsDialogOpen(open);
      }}>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Assign Consultant</DialogTitle>
              <DialogDescription>
                  Select a consultant for this request.
              </DialogDescription>
            </DialogHeader>
            <Select onValueChange={setSelectedConsultant}>
              <SelectTrigger>
                <SelectValue placeholder="Select a consultant" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter(u => u.role === 'consultant' && u.departmentId === consultations.find(con => con.id === currentConsultationId)?.departmentId)
                  .map(consultant => (
                  <SelectItem key={consultant.id} value={consultant.id}>{consultant.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={handleAssign}>Assign</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
