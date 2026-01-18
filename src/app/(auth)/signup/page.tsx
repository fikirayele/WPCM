'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const schoolLevels = ['Remedial', 'First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Fifth Year', 'Sixth Year', 'Seventh Year'];
const talentsOptions = ['Song', 'Preach', 'Leadership', 'Pray', 'Decorations', 'Media & Communication', 'Special Talents'];
const specialCareOptions = ['Financial Support', 'Consultation Support', 'Other'];

export default function SignupPage() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<User, 'id' | 'role' | 'active' | 'avatarUrl' | 'departmentId'>>({
      fullName: '',
      email: '',
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
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    // Add imagePreview to the user data before signing up
    const userDataWithAvatar = {
        ...formData,
        avatarUrl: imagePreview || `https://picsum.photos/seed/${Date.now()}/100/100`,
    };

    signup(userDataWithAvatar, password);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">Sign Up</CardTitle>
        <CardDescription className="text-balance text-muted-foreground">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" required onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Required for login" required onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="telegramUsername">Telegram User Name (Optional)</Label>
                <Input id="telegramUsername" name="telegramUsername" onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="motherChurch">Mother Church</Label>
                <Input id="motherChurch" name="motherChurch" required onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="entryYear">Year of Entry</Label>
                <Input id="entryYear" name="entryYear" type="number" required onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="departmentName">Name of Department</Label>
                <Input id="departmentName" name="departmentName" required onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="schoolLevel">Level in Your Schooling</Label>
                <Select name="schoolLevel" onValueChange={(value) => handleSelectChange('schoolLevel', value)} required>
                    <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                    <SelectContent>
                        {schoolLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="graduationYear">Year of Graduation</Label>
                <Input id="graduationYear" name="graduationYear" type="number" required onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label>Status 1</Label>
                 <Select name="studentStatus1" onValueChange={(value) => handleSelectChange('studentStatus1', value)} defaultValue="Regular">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Irregular (Private)">Irregular (Private)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label>Status 2</Label>
                 <Select name="studentStatus2" onValueChange={(value) => handleSelectChange('studentStatus2', value)} defaultValue="Degree Program">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Degree Program">Degree Program</SelectItem>
                        <SelectItem value="MS Program">MS Program</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label>Status 3</Label>
                 <Select name="studentStatus3" onValueChange={(value) => handleSelectChange('studentStatus3', value)} defaultValue="Current WPCM">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Current WPCM">Current WPCM</SelectItem>
                        <SelectItem value="Alumni WPCM">Alumni WPCM</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

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
            <Label>Special Care</Label>
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
            <Label>Upload Photo</Label>
            <div className="flex items-center gap-4">
                {imagePreview && <Image src={imagePreview} alt="Avatar Preview" width={64} height={64} className="rounded-full" />}
                <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="comments">Any Comments</Label>
            <Textarea id="comments" name="comments" onChange={handleInputChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
        </div>

        <Button type="submit" className="w-full">
          Create an account
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
      </CardContent>
    </Card>
  );
}
