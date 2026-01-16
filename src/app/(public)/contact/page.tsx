'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset();
    };

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Get In Touch</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          We're here to help and answer any question you might have.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Subject of your message" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here." className="min-h-[120px]" required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Our Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span>123 Faith Rd, Community City, 12345</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span>(123) 456-7890</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span>contact@faithconnect.org</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
