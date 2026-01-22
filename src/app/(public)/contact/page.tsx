'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Youtube, Facebook } from 'lucide-react';

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
        <div className="space-y-8">
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
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Our Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span>Wachemo PCM, Hossana, Ethiopia</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span>+251 957 939 740</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 flex-shrink-0 text-primary" />
                        <span>HossanaPCM@gmail.com</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Follow Us</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                     <a href="https://www.youtube.com/@wachemoPCM" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Youtube className="h-6 w-6"/></a>
                    <a href="https://www.facebook.com/WACHEMOPCM" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6"/></a>
                    <a href="#" target="_blank" rel="noreferrer" className="font-medium text-muted-foreground hover:text-primary">TikTok</a>
                    <a href="https://t.me/WachemoPCM12" target="_blank" rel="noreferrer" className="font-medium text-muted-foreground hover:text-primary">Telegram</a>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Our Location</CardTitle>
                <CardDescription>Find us in Hossana, Ethiopia.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31683.791519129528!2d37.8485299696285!3d7.556510344443834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b374828f011c39%3A0x95c8f828a2b53857!2sHosaena!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
