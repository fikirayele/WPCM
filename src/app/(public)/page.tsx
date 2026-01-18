import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { news, testimonials } from '@/lib/data';
import { ArrowRight, MessageCircle, Users, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  return (
    <div className="flex flex-col">
      <section className="relative flex h-screen w-full items-center justify-center bg-primary/10">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover opacity-10"
          />
        )}
        <div className="container relative mx-auto text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-6xl">
            A Sanctuary for Support &amp; Growth
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
            WPCM is a safe and confidential platform for guidance, counseling, and spiritual support from trusted professionals within our church community.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <Button size="lg" asChild>
                <Link href="/request-consultation">Request Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">How We Can Help</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/70">
              Whatever you're facing, you don't have to do it alone. We're here to walk alongside you.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-accent-foreground">
                   <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">Confidential Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Engage in private, one-on-one conversations with assigned pastors, doctors, and counselors.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-accent-foreground">
                   <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">Expert Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our team includes certified professionals from various fields, ready to provide expert guidance.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-accent-foreground">
                   <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">Spiritual Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find spiritual direction and grow in your faith with dedicated support from our pastoral team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">Latest News &amp; Announcements</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {news.slice(0, 3).map((article) => {
               const articleImage = PlaceHolderImages.find(img => img.id === `news-${article.id.split('-')[1]}`);
              return (
                <Card key={article.id} className="overflow-hidden">
                  {articleImage && (
                     <Image
                      src={articleImage.imageUrl}
                      alt={article.title}
                      data-ai-hint={articleImage.imageHint}
                      width={400}
                      height={250}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{article.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/news">View All News</Link>
            </Button>
          </div>
        </div>
      </section>

       <section className="bg-primary/10 py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">What Our Community Says</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/70">
              Hear from those who have found support and guidance through WPCM.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="flex flex-col justify-between text-center bg-card">
                <CardContent className="pt-6">
                  <blockquote className="text-lg italic text-foreground/80 before:content-['“'] after:content-['”']">
                    {testimonial.quote}
                  </blockquote>
                </CardContent>
                <CardHeader>
                  <div className="flex flex-col items-center gap-2">
                    <Avatar>
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
