'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';

export default function TestimonialsPage() {
  const { consultations, users } = useAuth();

  const testimonials = useMemo(() => {
    return consultations.filter(c => c.testimonial);
  }, [consultations]);

  const getInitials = (name = '') => name ? name.split(' ').map((n) => n[0]).join('') : '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Testimonials</h1>
        <p className="text-muted-foreground">
          Feedback submitted by students after their consultations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>
            Here you can review all feedback provided by students.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {testimonials.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No testimonials have been submitted yet.</p>
            ) : (
                testimonials.map(consultation => {
                    const student = users.find(u => u.id === consultation.studentId);
                    return (
                        <Card key={consultation.id} className="bg-muted/50">
                            <CardContent className="p-6">
                                <blockquote className="border-l-2 pl-4 italic text-foreground">
                                    "{consultation.testimonial}"
                                </blockquote>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                    <Avatar>
                                        <AvatarImage src={student?.avatarUrl} />
                                        <AvatarFallback>{getInitials(student?.fullName)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{student?.fullName}</p>
                                        <p className="text-sm text-muted-foreground">Student</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
            )}
        </CardContent>
      </Card>
    </div>
  );
}
