import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authBgImage = PlaceHolderImages.find(img => img.id === 'auth-background-image');

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-64 lg:h-full">
            {authBgImage && (
              <Image
                src={authBgImage.imageUrl}
                alt={authBgImage.description}
                data-ai-hint={authBgImage.imageHint}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="flex items-center justify-center p-6 sm:p-12">
            <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-6">
                {children}
            </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

    