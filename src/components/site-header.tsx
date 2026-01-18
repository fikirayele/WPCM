'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { User as UserIcon, LogOut, LayoutDashboard, BookUser, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
  { href: '/donate', label: 'Donate' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };
  
  if (!isClient) {
      return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                 <Logo />
            </div>
        </header>
      )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.role === 'student' && (
                            <DropdownMenuItem asChild>
                                <Link href="/consultations">
                                <BookUser className="mr-2 h-4 w-4" />
                                <span>My Consultations</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {(user.role === 'admin' || user.role === 'consultant') && (
                        <>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                        </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
                </>
            )}
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
                <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-xs">
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
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                            <p className="truncate font-semibold">{user.fullName}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Button variant="outline" asChild><Link href="/login">Login</Link></Button>
                            <Button asChild><Link href="/signup">Sign Up</Link></Button>
                        </div>
                    )}
                 </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
