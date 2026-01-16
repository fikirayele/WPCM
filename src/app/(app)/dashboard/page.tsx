import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Building2, Clock, UserCheck, CheckCircle2, AlertCircle, Pause } from 'lucide-react';
import { consultations, users, departments } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const activeConsultations = consultations.filter((c) => c.status === 'ACTIVE' || c.status === 'ASSIGNED');

  const stats = [
    { title: 'Total Users', value: users.length, icon: Users },
    { title: 'Total Consultations', value: consultations.length, icon: MessageSquare },
    { title: 'Pending Requests', value: consultations.filter(c => c.status === 'PENDING').length, icon: Clock },
    { title: 'Departments', value: departments.length, icon: Building2 },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PENDING': return 'destructive';
      case 'ASSIGNED': return 'secondary';
      case 'PAUSED': return 'outline';
      case 'COMPLETED': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'ACTIVE': return <UserCheck className="h-4 w-4" />;
        case 'PENDING': return <AlertCircle className="h-4 w-4" />;
        case 'ASSIGNED': return <Clock className="h-4 w-4" />;
        case 'PAUSED': return <Pause className="h-4 w-4" />;
        case 'COMPLETED': return <CheckCircle2 className="h-4 w-4" />;
        default: return null;
      }
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold text-primary">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Live Consultation Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Consultant</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeConsultations.map((c) => {
                const student = users.find(u => u.id === c.studentId);
                const consultant = users.find(u => u.id === c.consultantId);
                const department = departments.find(d => d.id === c.departmentId);
                return (
                  <TableRow key={c.id}>
                    <TableCell>{student?.name || 'N/A'}</TableCell>
                    <TableCell>{consultant?.name || 'N/A'}</TableCell>
                    <TableCell>{department?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {c.lastMessageAt ? `${formatDistanceToNow(new Date(c.lastMessageAt))} ago` : 'No messages'}
                    </TableCell>
                    <TableCell>
                       <Badge variant={getStatusVariant(c.status)} className="flex items-center gap-2">
                           {getStatusIcon(c.status)}
                           {c.status}
                       </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
