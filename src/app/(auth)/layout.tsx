import { Logo } from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/co.webp')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute top-8 left-8 z-10 [&_span]:text-white">
          <Logo />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
