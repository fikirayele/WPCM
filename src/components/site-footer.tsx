import { Logo } from './logo';
import Link from 'next/link';
import { Facebook, Youtube } from 'lucide-react';

const socialLinks = [
    { name: 'YouTube', href: 'https://www.youtube.com/@wachemoPCM', icon: Youtube },
    { name: 'Facebook', href: 'https://www.facebook.com/WACHEMOPCM', icon: Facebook },
    { name: 'TikTok', href: '#', icon: null }, // No official TikTok icon in lucide
    { name: 'Telegram', href: 'https://t.me/WachemoPCM12', icon: null },
];

const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/news', label: 'News' },
    { href: '/donate', label: 'Donate' },
];

export function SiteFooter() {
  return (
    <footer className="dark border-t bg-background text-foreground">
      <div className="container py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-start gap-4">
                <Logo />
                <p className="text-sm text-muted-foreground">
                    A sanctuary for support & growth.
                </p>
            </div>
            <div className="space-y-2">
                <h4 className="font-headline font-semibold">Quick Links</h4>
                <ul className="space-y-1">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="space-y-2">
                <h4 className="font-headline font-semibold">Contact Us</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Wachemo PCM</li>
                    <li>Tel: +251 957 939 740</li>
                    <li>Email: HossanaPCM@gmail.com</li>
                </ul>
            </div>
            <div className="space-y-2">
                <h4 className="font-headline font-semibold">Follow Us</h4>
                <div className="flex items-center space-x-2">
                    <a href="https://www.youtube.com/@wachemoPCM" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Youtube className="h-5 w-5"/></a>
                    <a href="https://www.facebook.com/WACHEMOPCM" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5"/></a>
                    <a href="#" target="_blank" rel="noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary">TikTok</a>
                    <a href="https://t.me/WachemoPCM12" target="_blank" rel="noreferrer" className="text-sm font-medium text-muted-foreground hover:text-primary">Telegram</a>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} WPCM. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
