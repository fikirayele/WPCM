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
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

const schoolLevels = ['Remedial', 'First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Fifth Year', 'Sixth Year', 'Seventh Year'];
const talentsOptions = ['Song', 'Preach', 'Leadership', 'Pray', 'Decorations', 'Media & Communication', 'Special Talents'];
const specialCareOptions = ['Financial Support', 'Consultation Support', 'Other'];

export default function RequestConsultationPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, addConsultation } = useAuth();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<Omit<Consultation, 'id' | 'studentId' | 'createdAt' | 'messages' | 'status' | 'fullName' | 'email' | 'photoUrl'>>({
        departmentId: '',
        problemDescription: '',
        preferredTime: '',
        phoneNumber: '',
        telegramUsername: '',
        motherChurch: '',
        entryYear: '',
        departmentName: '',
        schoolLevel: 'First Year',
        graduationYear: '',
        studentStatus1: 'Regular',
        studentStatus2: 'Degree Program',
        studentStatus3: 'Current WPCM',
        talents: [],
        specialCare: [],
        comments: '',
    });

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
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (group: 'talents' | 'specialCare', value: string) => {
        setFormData(prev => {
        const currentValues = prev[group];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        return { ...prev, [group]: newValues };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.departmentId || !formData.problemDescription || !formData.preferredTime) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all required fields.',
            });
            return;
        }

        const consultationData = {
            ...formData,
            photoUrl: imagePreview || user.avatarUrl,
        };
        
        addConsultation(consultationData);

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
            Please provide details about the support you are looking for. This will help us assign the right consultant for your needs. Your personal information will be kept confidential.
        </p>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>New Consultation Request</CardTitle>
            <CardDescription>Welcome, {user.fullName}. Your request will be kept confidential.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Card>
                <CardHeader><CardTitle className="text-lg font-headline">Consultation Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="departmentId">Select a Consultation Department</Label>
                        <Select onValueChange={(value) => handleSelectChange('departmentId', value)} value={formData.departmentId} required>
                            <SelectTrigger id="departmentId">
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
                        <Label htmlFor="problemDescription">Describe Your Issue</Label>
                        <Textarea
                            id="problemDescription"
                            name="problemDescription"
                            placeholder="Briefly describe the reason for your consultation request..."
                            className="min-h-[150px]"
                            value={formData.problemDescription}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time for Consultation</Label>
                        <Input 
                            id="preferredTime"
                            name="preferredTime" 
                            placeholder="e.g., Weekday evenings, Weekend mornings"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            required 
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader><CardTitle className="text-lg font-headline">Your Information</CardTitle><CardDescription>This information helps us understand your background. It will be sent with your request.</CardDescription></CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" required onChange={handleInputChange} value={formData.phoneNumber} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telegramUsername">Telegram User Name (Optional)</Label>
                            <Input id="telegramUsername" name="telegramUsername" onChange={handleInputChange} value={formData.telegramUsername} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motherChurch">Mother Church</Label>
                            <Input id="motherChurch" name="motherChurch" required onChange={handleInputChange} value={formData.motherChurch} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entryYear">Year of Entry</Label>
                            <Input id="entryYear" name="entryYear" type="number" required onChange={handleInputChange} value={formData.entryYear}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="departmentName">Name of Department</Label>
                            <Input id="departmentName" name="departmentName" required onChange={handleInputChange} value={formData.departmentName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="schoolLevel">Level in Your Schooling</Label>
                            <Select name="schoolLevel" onValueChange={(value) => handleSelectChange('schoolLevel', value)} required value={formData.schoolLevel}>
                                <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                                <SelectContent>
                                    {schoolLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="graduationYear">Year of Graduation</Label>
                            <Input id="graduationYear" name="graduationYear" type="number" required onChange={handleInputChange} value={formData.graduationYear} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status 1</Label>
                            <Select name="studentStatus1" onValueChange={(value) => handleSelectChange('studentStatus1', value)} defaultValue="Regular" value={formData.studentStatus1}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Regular">Regular</SelectItem>
                                    <SelectItem value="Irregular (Private)">Irregular (Private)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status 2</Label>
                            <Select name="studentStatus2" onValueChange={(value) => handleSelectChange('studentStatus2', value)} defaultValue="Degree Program" value={formData.studentStatus2}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Degree Program">Degree Program</SelectItem>
                                    <SelectItem value="MS Program">MS Program</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status 3</Label>
                            <Select name="studentStatus3" onValueChange={(value) => handleSelectChange('studentStatus3', value)} defaultValue="Current WPCM" value={formData.studentStatus3}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Current WPCM">Current WPCM</SelectItem>
                                    <SelectItem value="Alumni WPCM">Alumni WPCM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                 </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-lg font-headline">Additional Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Talent (Interest to Service)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {talentsOptions.map(talent => (
                            <div key={talent} className="flex items-center space-x-2">
                                <Checkbox id={`talent-${talent}`} onCheckedChange={() => handleCheckboxChange('talents', talent)} />
                                <Label htmlFor={`talent-${talent}`} className="font-normal">{talent}</Label>
                            </div>
                        ))}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Special Care Needed</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {specialCareOptions.map(care => (
                            <div key={care} className="flex items-center space-x-2">
                                <Checkbox id={`care-${care}`} onCheckedChange={() => handleCheckboxChange('specialCare', care)} />
                                <Label htmlFor={`care-${care}`} className="font-normal">{care}</Label>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Upload Photo (Optional)</Label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? <Image src={imagePreview} alt="Avatar Preview" width={64} height={64} className="rounded-full object-cover" /> :
                             <Image src={user.avatarUrl} alt="Your current avatar" width={64} height={64} className="rounded-full object-cover" />
                            }
                            <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <p className="text-xs text-muted-foreground">If you don't upload a new photo, your current profile picture will be used.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="comments">Any Comments</Label>
                        <Textarea id="comments" name="comments" onChange={handleInputChange} value={formData.comments} />
                    </div>
                </CardContent>
            </Card>
            
            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
