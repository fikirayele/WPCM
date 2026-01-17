import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Target, Heart } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-us-image');

  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">About WPCM</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Serving our community through faith, support, and connection.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div>
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                data-ai-hint={aboutImage.imageHint}
                width={600}
                height={400}
                className="rounded-lg shadow-md"
              />
            )}
        </div>
        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold text-primary">Our Foundation</h2>
          <p className="text-foreground/70">
            WPCM was born from a desire to extend our church's pastoral care into the digital space, ensuring every member of our community feels heard, supported, and valued. We believe in the power of connection to foster spiritual and personal growth.
          </p>
          <p className="text-foreground/70">
            Our platform provides a bridge to professional and spiritual guidance, grounded in the principles of confidentiality, compassion, and faith. We aim to be a sanctuary where individuals can find strength and clarity for life's challenges.
          </p>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Target className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">To provide accessible, confidential, and compassionate support that empowers individuals to navigate life's challenges through faith-based guidance.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Eye className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">To build a resilient and spiritually connected community where every member has the resources and support to thrive in their personal and spiritual lives.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Heart className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-xl">Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Compassion, Integrity, Confidentiality, and Faith. These pillars guide every interaction and decision on the WPCM platform.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
