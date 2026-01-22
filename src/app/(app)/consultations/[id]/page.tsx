'use client';

import { departments } from '@/lib/data';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatClient } from './_components/chat-client';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConsultationDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, consultations, users } = useAuth();
  const router = useRouter();
  const consultation = consultations.find(c => c.id === params.id);

  if (!consultation) {
    notFound();
  }

  const student = users.find(u => u.id === consultation.studentId);
  const consultant = users.find(u => u.id === consultation.consultantId);
  const department = departments.find(d => d.id === consultation.departmentId);

  const getInitials = (name = '') => name ? name.split(' ').map((n) => n[0]).join('') : '';

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
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium break-words">{displayValue}</p>
        </div>
    )
  };

  const isAdminView = user?.role === 'admin';

  if (isAdminView) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center pt-2">
                <h1 className="font-headline text-3xl font-bold text-primary">Consultation Details</h1>
                {consultation.status === 'PENDING' && (
                    <Button size="sm" onClick={() => router.push('/consultations')}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Consultant
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Status</p>
                        <Badge variant={getStatusVariant(consultation.status)} className="mt-1">{consultation.status.replace(/_/g, ' ')}</Badge>
                    </div>
                    {department && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Department</p>
                            <p className="font-semibold">{department.name}</p>
                        </div>
                    )}
                    {student && (
                      <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                              <AvatarImage src={student.avatarUrl} />
                              <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="text-xs text-muted-foreground">Student</p>
                              <p className="font-semibold">{student.fullName}</p>
                          </div>
                      </div>
                    )}
                    {consultant && (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={consultant.avatarUrl} />
                                <AvatarFallback>{getInitials(consultant.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs text-muted-foreground">Consultant</p>
                                <p className="font-semibold">{consultant.fullName}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 pt-4">
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
                        <div className="md:col-span-2"><InfoItem label="Talents / Service Interests" value={consultation.talents} /></div>
                        <div className="md:col-span-2"><InfoItem label="Special Care Needs" value={consultation.specialCare} /></div>
                    </div>
                     <div className="pt-4">
                         <InfoItem label="Additional Comments" value={consultation.comments} />
                     </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col">
          <ChatClient consultation={consultation} student={student} consultant={consultant} />
      </div>
      <aside className="hidden w-96 flex-shrink-0 border-l bg-card p-4 lg:flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-headline text-xl text-primary">Consultation Details</h2>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <Badge variant={getStatusVariant(consultation.status)} className="mt-1">{consultation.status.replace(/_/g, ' ')}</Badge>
                </div>
                 {department && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Department</p>
                        <p className="font-semibold">{department.name}</p>
                    </div>
                )}
                 {(user?.role === 'student' ? consultant : student) && (
                  <div>
                      <p className="text-xs font-medium text-muted-foreground">{user?.role === 'student' ? 'Consultant' : 'Student'}</p>
                      <div className="flex items-center gap-3 mt-1">
                          <Avatar className="h-9 w-9">
                              <AvatarImage src={user?.role === 'student' ? consultant?.avatarUrl : student?.avatarUrl} />
                              <AvatarFallback>{getInitials(user?.role === 'student' ? consultant?.fullName : student?.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="font-semibold">{user?.role === 'student' ? consultant?.fullName : student?.fullName}</p>
                              <p className="text-xs text-muted-foreground">{user?.role === 'student' ? consultant?.email : student?.email}</p>
                          </div>
                      </div>
                  </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Problem Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{consultation.problemDescription}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-sm">Your Submitted Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <InfoItem label="Full Name" value={consultation.fullName} />
                    <InfoItem label="Email" value={consultation.email} />
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
      </aside>
    </div>
  );
}
