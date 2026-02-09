'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
            <Logo />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    'transition-colors hover:text-foreground/80',
                     pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
                >
                {link.label}
                </Link>
            ))}
            </nav>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                  <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex w-full flex-col bg-card p-0 sm:max-w-xs">
                <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
                <div className="flex h-16 shrink-0 items-center border-b px-6">
                    <Logo />
                </div>
                <nav className="flex-1 space-y-1 p-4">
                    {navLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'block rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                            pathname === link.href && 'bg-muted text-foreground'
                        )}
                        >
                        {link.label}
                        </Link>
                    ))}
                </nav>
                 <div className="mt-auto border-t p-4">
                    <div className="grid gap-2">
                        <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
                        <Button asChild><Link href="/signup">Sign Up</Link></Button>
                    </div>
                 </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
