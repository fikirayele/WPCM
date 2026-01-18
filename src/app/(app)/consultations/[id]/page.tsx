'use client';

import { departments } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatClient } from './_components/chat-client';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

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
  
  const InfoItem = ({ label, value }: { label: string; value?: string | string[] | null }) => {
    if (!value) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{displayValue}</p>
        </div>
    )
  };


  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col">
          <ChatClient consultation={consultation} student={student} consultant={consultant} />
      </div>
      <div className="hidden w-96 flex-shrink-0 border-l bg-card p-4 lg:flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-headline text-xl text-primary">Consultation Details</h2>
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Badge variant={getStatusVariant(consultation.status)}>{consultation.status.replace('_', ' ')}</Badge>
            </CardContent>
        </Card>

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
                <CardHeader><CardTitle className="text-base">Consultation Department</CardTitle></CardHeader>
                <CardContent>
                    <p className="font-semibold">{department.name}</p>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                <CardTitle className="text-base">Problem Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{consultation.problemDescription}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-base">Submitter Information</CardTitle>
                <CardDescription>This information was submitted with the request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    {consultation.photoUrl && <Image src={consultation.photoUrl} alt={consultation.fullName} width={64} height={64} className="rounded-full object-cover aspect-square" />}
                    <div>
                        <p className="font-semibold">{consultation.fullName}</p>
                        <p className="text-xs text-muted-foreground">{consultation.email}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <InfoItem label="Phone Number" value={consultation.phoneNumber} />
                    <InfoItem label="Telegram" value={consultation.telegramUsername} />
                    <InfoItem label="Mother Church" value={consultation.motherChurch} />
                    <InfoItem label="Entry Year" value={consultation.entryYear} />
                    <InfoItem label="Student Department" value={consultation.departmentName} />
                    <InfoItem label="School Level" value={consultation.schoolLevel} />
                    <InfoItem label="Graduation Year" value={consultation.graduationYear} />
                    <InfoItem label="Student Status 1" value={consultation.studentStatus1} />
                    <InfoItem label="Student Status 2" value={consultation.studentStatus2} />
                    <InfoItem label="Student Status 3" value={consultation.studentStatus3} />
                </div>
                 <div className="space-y-4 pt-4">
                     <InfoItem label="Talents / Service Interests" value={consultation.talents} />
                     <InfoItem label="Special Care Needs" value={consultation.specialCare} />
                     <InfoItem label="Additional Comments" value={consultation.comments} />
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
