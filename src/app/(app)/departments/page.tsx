import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartmentActions } from './_components/department-actions';

export default function DepartmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold text-primary">Department Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentActions />
        </CardContent>
      </Card>
    </div>
  );
}
