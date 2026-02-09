'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, MessageCircle, Users, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { NewsArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const { firestore } = useFirebase();

  const newsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'newsAnnouncements');
  }, [firestore]);
  const { data: news, isLoading: isNewsLoading } = useCollection<NewsArticle>(newsCollectionRef);

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[85vh] w-full items-center justify-center bg-primary/10">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover opacity-10"
          />
        )}
        <div className="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
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

      <section className="bg-background py-12 md:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">How We Can Help</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground/70">
              Whatever you're facing, you don't have to do it alone. We're here to walk alongside you.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center card-hover-effect group">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-background/20 text-accent-foreground">
                   <MessageCircle className="h-6 w-6 text-primary group-hover:text-background" />
                </div>
                <CardTitle className="font-headline text-xl group-hover:text-background">Confidential Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-background/80">
                  Engage in private, one-on-one conversations with assigned pastors, doctors, and counselors.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center card-hover-effect group">
              <CardHeader>
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-background/20 text-accent-foreground">
                   <Users className="h-6 w-6 text-primary group-hover:text-background" />
                </div>
                <CardTitle className="font-headline text-xl group-hover:text-background">Expert Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-background/80">
                  Our team includes certified professionals from various fields, ready to provide expert guidance.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center card-hover-effect group">
              <CardHeader>
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-background/20 text-accent-foreground">
                   <HeartHandshake className="h-6 w-6 text-primary group-hover:text-background" />
                </div>
                <CardTitle className="font-headline text-xl group-hover:text-background">Spiritual Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-background/80">
                  Find spiritual direction and grow in your faith with dedicated support from our pastoral team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold text-primary">Latest News &amp; Announcements</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {isNewsLoading ? (
                [...Array(3)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                             <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                ))
            ) : (
                news && news.slice(0, 3).map((article) => {
                return (
                    <Card key={article.id} className="overflow-hidden card-hover-effect group">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={400}
                        height={250}
                        className="h-48 w-full object-cover"
                        />
                    <CardHeader>
                        <CardTitle className="font-headline text-lg group-hover:text-background">{article.title}</CardTitle>
                        <p className="text-sm text-muted-foreground group-hover:text-background/80">{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground group-hover:text-background/80 line-clamp-3">{article.content}</p>
                    </CardContent>
                    </Card>
                );
                })
            )}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/news">View All News</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

    