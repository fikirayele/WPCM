'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { FileUp } from 'lucide-react';

export default function RequestConsultationPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Request Submitted",
            description: "Your information has been submitted successfully. We will get back to you shortly.",
        });
        // In a real app, you might want to redirect or clear the form.
    };
    
    const studyLevels = [
        "Remedial", "First Year", "Second Year", "Third Year", 
        "Fourth Year", "Fifth Year", "Sixth Year", "Seventh Year"
    ];
    
    const talents = [
        "Singing", "Preaching", "Leadership", "Prayer Ministry", 
        "Decoration", "Media & Communication"
    ];

  return (
    <div className="space-y-8 py-12 px-4">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold text-primary">WPCM Student Consultation & Support Form</h1>
        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Please complete this form carefully. The information you provide will help us assign the right mentor, counselor, or support team to serve you better.
        </p>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Section 1: Personal Information */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">1. Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input id="email" type="email" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram Username (Optional)</Label>
                        <Input id="telegram" />
                    </div>
                </div>
            </div>

            {/* Section 2: Family & Background */}
             <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">2. Family & Background</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="motherChurch">Mother Church (Where are you from?)</Label>
                        <Input id="motherChurch" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="entryYear">Year of Entry to WPCM</Label>
                        <Input id="entryYear" type="number" placeholder="e.g., 2020" required />
                    </div>
                </div>
            </div>


            {/* Section 3: Academic Information */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">3. Academic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="department">Department / Field of Study</Label>
                        <Input id="department" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gradYear">Expected Year of Graduation</Label>
                        <Input id="gradYear" type="number" placeholder="e.g., 2025" required />
                    </div>
                </div>
                <div className="space-y-2 pt-4">
                    <Label>Current Level of Study</Label>
                    <RadioGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-md border p-4">
                        {studyLevels.map(level => {
                            const levelId = `level-${level.toLowerCase().replace(/ /g, '-')}`;
                            return (
                                <div key={level} className="flex items-center space-x-2">
                                    <RadioGroupItem value={levelId} id={levelId} />
                                    <Label htmlFor={levelId} className="font-normal">{level}</Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            </div>

            {/* Section 4: Study Status */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">4. Study Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                     <div className="space-y-2">
                        <Label>Study Mode</Label>
                        <RadioGroup defaultValue="regular" className="flex flex-col space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="regular" id="regular" />
                                <Label htmlFor="regular" className="font-normal">Regular</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="irregular" id="irregular" />
                                <Label htmlFor="irregular" className="font-normal">Irregular (Private)</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label>Program Type</Label>
                        <RadioGroup defaultValue="degree" className="flex flex-col space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="degree" id="degree" />
                                <Label htmlFor="degree" className="font-normal">Degree Program</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="masters" id="masters" />
                                <Label htmlFor="masters" className="font-normal">Master’s (MS) Program</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label>WPCM Status</Label>
                        <RadioGroup defaultValue="current" className="flex flex-col space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="current" id="current" />
                                <Label htmlFor="current" className="font-normal">Current WPCM Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="alumni" id="alumni" />
                                <Label htmlFor="alumni" className="font-normal">WPCM Alumni</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>

            {/* Section 5: Talents & Areas of Interest */}
             <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">5. Talents & Areas of Interest (Service to the Church)</h2>
                 <p className="text-sm text-muted-foreground pt-2">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 rounded-md border p-4 mt-2">
                    {talents.map(talent => {
                        const talentId = `talent-${talent.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`;
                        return (
                            <div key={talent} className="flex items-center space-x-2">
                                <Checkbox id={talentId} />
                                <Label htmlFor={talentId} className="font-normal">{talent}</Label>
                            </div>
                        );
                    })}
                </div>
                 <div className="space-y-2 pt-4">
                    <Label htmlFor="otherTalents">Other Special Talents</Label>
                    <Input id="otherTalents" />
                </div>
            </div>

            {/* Section 6: Support You Are Requesting */}
             <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">6. Support You Are Requesting</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-md border p-4 mt-2">
                     <div className="flex items-center space-x-2">
                        <Checkbox id="support-financial" />
                        <Label htmlFor="support-financial" className="font-normal">Financial Support</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="support-consultation" />
                        <Label htmlFor="support-consultation" className="font-normal">Consultation / Counseling</Label>
                    </div>
                </div>
                 <div className="space-y-2 pt-4">
                    <Label htmlFor="otherSupport">Other Support (please specify)</Label>
                    <Input id="otherSupport" />
                </div>
            </div>
            
            {/* Section 7: Upload Your Photo */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">7. Upload Your Photo</h2>
                <div className="flex items-center justify-center w-full pt-4">
                    <Label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-primary/5">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">Please upload a clear and recent photo</p>
                        </div>
                        <Input id="file-upload" type="file" className="hidden" />
                    </Label>
                </div> 
            </div>

            {/* Section 8: Additional Comments */}
            <div className="space-y-4">
                 <h2 className="text-xl font-semibold font-headline text-primary border-b pb-2">8. Additional Comments or Requests</h2>
                 <Label htmlFor="comments" className="text-muted-foreground">Tell us anything you would like us to know about your situation, needs, or goals</Label>
                <Textarea
                    id="comments"
                    className="min-h-[150px]"
                />
            </div>
            
            <Separator />

            <Button type="submit" className="w-full" size="lg">
              Submit Form
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
