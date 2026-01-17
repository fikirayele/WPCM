import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ContentActions } from './_components/content-actions';

export default function PublicContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
          Content Management
        </h1>
        <p className="text-muted-foreground">
          Manage news, announcements, and videos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles & Posts</CardTitle>
          <CardDescription>
            Here you can add, edit, or delete articles that appear on the public
            "News" page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentActions />
        </CardContent>
      </Card>
    </div>
  );
}
