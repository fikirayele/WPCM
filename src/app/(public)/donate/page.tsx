'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DollarSign } from 'lucide-react';
import React, { useState } from 'react';

const donationAmounts = [25, 50, 100, 250, 500];

export default function DonatePage() {
    const [amount, setAmount] = useState(50);
    const { toast } = useToast();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
        setAmount(value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Thank You!",
            description: `Your generous donation of $${amount} has been received.`,
        });
         (e.target as HTMLFormElement).reset();
         setAmount(50);
    };

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Support Our Mission</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Your generous contribution helps us continue our work in the community, providing support, guidance, and a place of spiritual growth for all.
        </p>
      </div>

      <div className="mt-16 mx-auto max-w-xl">
        <Card>
            <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Make a Donation</CardTitle>
            <CardDescription>Choose an amount or enter a custom one.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {donationAmounts.map((predefinedAmount) => (
                <Button
                  key={predefinedAmount}
                  type="button"
                  variant={amount === predefinedAmount ? 'default' : 'outline'}
                  onClick={() => setAmount(predefinedAmount)}
                >
                  ${predefinedAmount}
                </Button>
              ))}
                <div className="relative col-span-3">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="number"
                        placeholder="Custom Amount"
                        value={amount || ''}
                        onChange={handleAmountChange}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required/>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg">
              Donate ${amount}
            </Button>
          </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
