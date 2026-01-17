'use client';

import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { news as initialNews } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { NewsArticle } from '@/lib/types';
import { format } from 'date-fns';
import { MoreHorizontal, PlusCircle } from 'lucide-react';

export function ContentActions() {
  const [articles, setArticles] = useState<NewsArticle[]>(initialNews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(
    null
  );
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const imageUrl =
      (formData.get('imageUrl') as string) ||
      currentArticle?.imageUrl ||
      PlaceHolderImages.find((img) => img.id === 'news-1')?.imageUrl ||
      '';

    if (currentArticle) {
      const updatedArticle = { ...currentArticle, title, content, author, imageUrl };
      setArticles(
        articles.map((a) => (a.id === currentArticle.id ? updatedArticle : a))
      );
      toast({
        title: 'Article Updated',
        description: `"${title}" has been successfully updated.`,
      });
    } else {
      const newArticle: NewsArticle = {
        id: `news-${Date.now()}`,
        title,
        content,
        author,
        imageUrl,
        publishedAt: new Date().toISOString(),
      };
      setArticles([newArticle, ...articles]);
      toast({
        title: 'Article Added',
        description: `"${title}" has been successfully published.`,
      });
    }
    setIsDialogOpen(false);
    setCurrentArticle(null);
  };

  const handleDelete = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    setArticles(articles.filter((a) => a.id !== articleId));
    toast({
      title: 'Article Deleted',
      description: `"${article?.title}" has been deleted.`,
      variant: 'destructive',
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentArticle(null)}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle className="font-headline">
                  {currentArticle ? 'Edit' : 'Create'} Article
                </DialogTitle>
                <DialogDescription>
                  {currentArticle
                    ? 'Update the details for this article.'
                    : 'Write and publish a new article.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentArticle?.title}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    defaultValue={currentArticle?.author}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid items-start grid-cols-4 gap-4">
                  <Label htmlFor="content" className="pt-2 text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={currentArticle?.content}
                    className="col-span-3 min-h-[150px]"
                    required
                  />
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={currentArticle?.imageUrl}
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save & Publish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>{format(new Date(article.publishedAt), 'PP')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCurrentArticle(article);
                          setIsDialogOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                          >
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the article.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(article.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
