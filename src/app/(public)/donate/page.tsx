'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Banknote, FileUp, ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function DonatePage() {
    const { toast } = useToast();
    const { addDonation } = useAuth();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const phoneNumber = formData.get('phoneNumber') as string;
        const amount = formData.get('amount') as string;
        const transactionId = formData.get('transactionId') as string;

        if (!name || !phoneNumber || !amount || !transactionId || !imagePreview) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill out all fields and upload a screenshot.',
            });
            return;
        }

        addDonation({
            name,
            phoneNumber,
            amount: parseFloat(amount),
            transactionId,
            screenshotUrl: imagePreview,
        });

        toast({
            title: "Submission Received!",
            description: `Thank you, ${name}. We have received your donation information and will send a confirmation SMS to ${phoneNumber} shortly.`,
        });
        
        form.reset();
        setImagePreview(null);
    };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Support Our Mission</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Your generous contribution helps us continue our work in the community, providing support, guidance, and a place of spiritual growth for all.
        </p>
      </div>

      <div className="mt-16 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">How to Donate</CardTitle>
                <CardDescription>Follow these steps to make your contribution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <Banknote className="h-4 w-4" />
                    <AlertTitle>CBE (Commercial Bank of Ethiopia)</AlertTitle>
                    <AlertDescription className="font-mono">
                        Account: 1000123456789<br/>
                        Name: WPCM Ministry
                    </AlertDescription>
                </Alert>
                <Alert>
                    <Banknote className="h-4 w-4" />
                    <AlertTitle>Telebirr</AlertTitle>
                    <AlertDescription className="font-mono">
                        Number: 0912345678
                    </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                    After making your donation using one of the methods above, please fill out the form on the right with your details and a screenshot of your transaction receipt.
                </p>
            </CardContent>
        </Card>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="font-headline">Confirm Your Donation</CardTitle>
              <CardDescription>Please fill out this form after you have sent your donation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number (for SMS confirmation)</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="0912345678" required/>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="amount">Amount Sent (in Birr)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="500" required/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID / Reference</Label>
                  <Input id="transactionId" name="transactionId" placeholder="e.g., FT23342..." required/>
              </div>
              <div className="space-y-2">
                <Label>Transaction Screenshot</Label>
                {imagePreview ? (
                    <div className="relative aspect-video w-full">
                        <Image src={imagePreview} alt="Screenshot preview" fill className="rounded-md object-contain border" />
                    </div>
                    ) : (
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-card">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Upload a screenshot</p>
                        </div>
                    </div>
                )}
                <Label htmlFor="file-upload" className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80 text-sm">
                    <FileUp className="w-4 h-4 mr-2" />
                    <span>{imagePreview ? 'Change' : 'Upload'} Screenshot</span>
                    <Input id="file-upload" name="screenshot" type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg">
                Submit Donation Proof
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
