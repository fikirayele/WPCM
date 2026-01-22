import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Handshake, Mountain, Target, Eye } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-us-image');

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h1 className="font-headline text-4xl font-bold text-primary">About WPCM</h1>
          <p className="text-lg text-foreground/80">
            WPCM is a dedicated ministry within the Seventh-day Adventist Church, focused on nurturing the spiritual, mental, and social well-being of students on non-Adventist campuses. We provide a sanctuary for support and growth, guided by our core principles of faith and community.
          </p>
           <p className="text-foreground/70">
            Our mission is to empower students to become strong ambassadors for Christ, equipped to handle the challenges of campus life while strengthening their relationship with God. We offer confidential counseling, mentorship, and a vibrant community to help them thrive.
          </p>
        </div>
        <div>
          {aboutImage && (
            <Image
              src={aboutImage.imageUrl}
              alt={aboutImage.description}
              data-ai-hint={aboutImage.imageHint}
              width={600}
              height={400}
              className="rounded-lg shadow-md object-cover"
            />
          )}
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col card-hover-effect">
            <CardHeader className="items-center text-center">
              <Eye className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="font-headline text-2xl text-primary">Aim/Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground flex-grow">
              <p>
                To transform students on non-Adventist campuses into Seventh-day Adventist ambassadors of Christ in colleges/universities, churches, communities, and the world at large.
              </p>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col card-hover-effect">
            <CardHeader className="items-center text-center">
              <Target className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="font-headline text-2xl text-primary">Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground flex-grow">
              <p>
                To inspire Seventh-day Adventist students to be disciples of Christ and empower them to share the everlasting gospel on campus.
              </p>
            </CardContent>
          </Card>
      </section>

      {/* Core Values Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-primary">Our Core Values (The 3Cs)</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="text-center card-hover-effect">
            <CardHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-xl mt-4">Character</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">Character over competency.</p>
            </CardContent>
          </Card>
          <Card className="text-center card-hover-effect">
            <CardHeader>
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                 <Handshake className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-xl mt-4">Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">Collaboration over competition.</p>
            </CardContent>
          </Card>
          <Card className="text-center card-hover-effect">
            <CardHeader>
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                 <Mountain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-headline text-xl mt-4">Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">Challenge over criticism.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
