import { Feather } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Feather className="h-6 w-6 text-primary" />
      <span className="text-xl font-headline font-bold text-primary">FaithConnect</span>
    </Link>
  );
}
