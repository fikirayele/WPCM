'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { departments } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Consultation } from '@/lib/types';
import { useState } from 'react';

export default function RequestConsultationPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, addConsultation } = useAuth();
    const [departmentId, setDepartmentId] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [preferredTime, setPreferredTime] = useState('');


    if (!user) {
        return (
            <div className="flex h-full items-center justify-center">
                <Card className="max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Login Required</CardTitle>
                        <CardDescription>
                            You need to be logged in to request a consultation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Button asChild>
                            <Link href="/login">Login or Sign Up</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!departmentId || !problemDescription || !preferredTime) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all fields.',
            });
            return;
        }

        const newConsultationRequest: Omit<Consultation, 'id' | 'studentId' | 'messages' | 'createdAt'> = {
            departmentId,
            problemDescription,
            preferredTime,
            status: 'PENDING',
        };
        
        addConsultation(newConsultationRequest);

        toast({
            title: "Request Submitted",
            description: "Your consultation request has been submitted. An admin will assign a consultant shortly.",
        });
        router.push('/consultations');
    };

    return (
    <div className="space-y-8">
       <div className="text-center">
        <h1 className="font-headline text-3xl font-bold text-primary">Request a Consultation</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Please provide details about the support you are looking for. This will help us assign the right consultant for your needs.
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>New Consultation Request</CardTitle>
            <CardDescription>Welcome, {user.fullName}. Your request will be kept confidential.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
                <Label htmlFor="department">Select a Department</Label>
                <Select onValueChange={setDepartmentId} value={departmentId} required>
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Choose a department..." />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="problem">Describe Your Issue</Label>
                <Textarea
                    id="problem"
                    placeholder="Briefly describe the reason for your consultation request..."
                    className="min-h-[150px]"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="timing">Preferred Time for Consultation</Label>
                <Input 
                    id="timing" 
                    placeholder="e.g., Weekday evenings, Weekend mornings"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required 
                />
            </div>
            
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
