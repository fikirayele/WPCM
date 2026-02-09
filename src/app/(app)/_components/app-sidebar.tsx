'use client';

import {
  Bell,
  BookUser,
  Building2,
  CircleDollarSign,
  HeartHandshake,
  Home,
  LogOut,
  MessageSquare,
  Users,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase, useUser, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import type { User } from '@/lib/types';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

const getInitials = (name = '') => name ? name.split(' ').map((n) => n[0]).join('') : '';

export function AppSidebar() {
  const pathname = usePathname();
  const { auth, firestore, isUserLoading } = useFirebase();
  const { user: authUser } = useUser();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: user, isLoading: isUserDocLoading } = useDoc<User>(userRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const adminNav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/departments', label: 'Departments', icon: Building2 },
    { href: '/consultations', label: 'Consultations', icon: MessageSquare },
    { href: '/donations', label: 'Donations', icon: CircleDollarSign },
    { href: '/testimonials', label: 'Testimonials', icon: Star },
    { href: '/public-content', label: 'News', icon: Bell },
  ];

  const consultantNav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/consultations', label: 'My Consultations', icon: MessageSquare },
  ];

  const studentNav = [
    { href: '/request-consultation', label: 'Request Consultation', icon: HeartHandshake },
    { href: '/consultations', label: 'My Consultations', icon: BookUser },
  ];
  
  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'consultant' ? consultantNav : studentNav;
  const isLoading = isUserLoading || isUserDocLoading;

  if (isLoading) {
    return (
        <div className="flex h-full flex-col p-4">
            <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="mt-auto border-t pt-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
              pathname === item.href && 'bg-primary/10 text-primary',
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t p-4">
        {user && (
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold">{user.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
