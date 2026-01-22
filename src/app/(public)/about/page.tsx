import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Handshake, Mountain, Target } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const adventistLogo = PlaceHolderImages.find((img) => img.id === 'adventist-logo');

  return (
    <div className="container py-16 md:py-24 space-y-24">
      
      {/* Aim/Vision Section */}
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">Our Vision</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
          To transform students on non-Adventist campuses into Seventh-day Adventist ambassadors of Christ
in colleges/universities, churches, communities, and the world at large.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="items-center text-center">
            <Target className="h-10 w-10 text-primary mb-2" />
            <CardTitle className="font-headline text-3xl text-primary">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-foreground/80">
              To inspire Seventh-day Adventist students to be disciples of Christ and
empower them to share the everlasting
gospel on campus.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Core Values Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-primary">Our Core Values (The 3Cs)</h2>
          <p className="text-lg text-muted-foreground mt-2">Guiding our actions and decisions.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl mt-4">Character</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">Character over competency.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                 <Handshake className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl mt-4">Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">Collaboration over competition.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                 <Mountain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl mt-4">Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">Challenge over criticism.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Motto & Slogan */}
      <section className="text-center bg-muted/50 py-16 rounded-lg">
        <div className="space-y-4">
            <h3 className="font-headline text-xl text-muted-foreground">Motto</h3>
            <p className="font-headline text-3xl font-bold text-primary">Follow Jesus. Embrace His Mission. Change the World.</p>
        </div>
        <div className="mt-8 space-y-2">
            <h3 className="font-headline text-xl text-muted-foreground">Slogan</h3>
            <p className="text-2xl text-foreground/80">Inspire to Be. Empower to Share.</p>
        </div>
      </section>

      {/* Key Text */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="font-headline text-3xl font-bold text-primary mb-4">Our Key Text</h2>
         <blockquote className="text-2xl italic text-foreground/90 border-l-4 border-primary pl-6">
            “Be ye followers of me, even as I also am of Christ”
        </blockquote>
        <p className="mt-4 text-right text-lg text-muted-foreground">(1 Corinthians 11:1, KJV)</p>
      </section>

      {adventistLogo && (
        <section className="flex flex-col items-center text-center border-t pt-12">
            <Image 
                src={adventistLogo.imageUrl}
                alt={adventistLogo.description}
                data-ai-hint={adventistLogo.imageHint}
                width={100}
                height={100}
                className="mb-4"
            />
            <p className="text-sm text-muted-foreground max-w-md">
                WPCM operates in harmony with the mission and values of the Seventh-day Adventist Church.
            </p>
        </section>
      )}

    </div>
  );
}
