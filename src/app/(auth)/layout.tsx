import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
           <div className="grid gap-2 text-center mb-4">
             <div className="flex justify-center">
                <Logo />
            </div>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/co.webp"
          alt="A beautiful, calming image for the authentication screen."
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
