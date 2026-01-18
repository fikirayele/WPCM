'use client';

import { departments } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatClient } from './_components/chat-client';
import { useAuth } from '@/hooks/use-auth';

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const { consultations, users } = useAuth();
  const consultation = consultations.find(c => c.id === params.id);

  if (!consultation) {
    notFound();
  }

  const student = users.find(u => u.id === consultation.studentId);
  const consultant = users.find(u => u.id === consultation.consultantId);
  const department = departments.find(d => d.id === consultation.departmentId);

  const getInitials = (name = '') => name.split(' ').map((n) => n[0]).join('');

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

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col">
          <ChatClient consultation={consultation} student={student} consultant={consultant} />
      </div>
      <div className="hidden w-80 flex-shrink-0 border-l bg-card p-4 lg:flex flex-col gap-4">
        <h2 className="font-headline text-xl text-primary">Consultation Details</h2>
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Badge variant={getStatusVariant(consultation.status)}>{consultation.status.replace('_', ' ')}</Badge>
            </CardContent>
        </Card>
        
        {student && (
            <Card>
                <CardHeader><CardTitle className="text-base">Student</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{student.fullName}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                </CardContent>
            </Card>
        )}

        {consultant && (
            <Card>
                <CardHeader><CardTitle className="text-base">Consultant</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={consultant.avatarUrl} />
                        <AvatarFallback>{getInitials(consultant.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{consultant.fullName}</p>
                        <p className="text-xs text-muted-foreground">{consultant.email}</p>
                    </div>
                </CardContent>
            </Card>
        )}
        
        {department && (
            <Card>
                <CardHeader><CardTitle className="text-base">Department</CardTitle></CardHeader>
                <CardContent>
                    <p className="font-semibold">{department.name}</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
