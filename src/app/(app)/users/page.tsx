import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserActions } from './_components/user-actions';

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Add, edit, and manage all users in the system.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users including students, consultants, and admins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserActions />
        </CardContent>
      </Card>
    </div>
  );
}
