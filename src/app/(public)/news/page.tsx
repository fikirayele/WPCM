import { news } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';

export default function NewsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">News &amp; Announcements</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Stay up to date with the latest happenings in our community.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {news.map((article) => {
          const articleImage = PlaceHolderImages.find(img => img.id === `news-${article.id.split('-')[1]}`);
          return (
          <Card key={article.id} className="flex flex-col overflow-hidden card-hover-effect">
             {articleImage && (
               <div className="aspect-video relative">
                <Image
                  src={articleImage.imageUrl}
                  alt={article.title}
                  data-ai-hint={articleImage.imageHint}
                  fill
                  className="object-cover"
                />
                </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                By {article.author} on {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
              </p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{article.content}</p>
            </CardContent>
          </Card>
        )})}
      </div>
    </div>
  );
}
