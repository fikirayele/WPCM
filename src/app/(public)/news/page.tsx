'use client';

import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import type { NewsArticle } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsPage() {
  const { firestore } = useFirebase();
  const newsCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'newsAnnouncements');
  }, [firestore]);
  const { data: news, isLoading } = useCollection<NewsArticle>(newsCollectionRef);

  const renderSkeletons = () => (
    [...Array(3)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    ))
  );

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">News &amp; Announcements</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Stay up to date with the latest happenings in our community.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? renderSkeletons() : news && news.map((article) => {
          return (
          <Card key={article.id} className="flex flex-col overflow-hidden card-hover-effect group">
               <div className="aspect-video relative">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl group-hover:text-background">{article.title}</CardTitle>
              <p className="text-sm text-muted-foreground group-hover:text-background/80">
                By {article.author} on {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
              </p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground group-hover:text-background/80">{article.content}</p>
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
}

    