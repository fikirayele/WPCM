import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
       <div className="relative h-64 lg:h-full">
        <Image
          src="/co1.jpg"
          alt="A beautiful, calming image for the authentication screen."
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/20" />
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-6">
           <div className="grid gap-2 text-center mb-4">
             <div className="flex justify-center">
                <Logo />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
