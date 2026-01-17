import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { donations } from '@/lib/data';
import { format } from 'date-fns';

export default function DonationsPage() {
    const totalDonations = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary">Donations</h1>
          <p className="text-muted-foreground">View all financial contributions.</p>
        </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Total Donated</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {totalDonations.toLocaleString()} Birr
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Donors</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {donations.length}
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>
            A list of recent donations made to the church.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.name}</TableCell>
                  <TableCell>{donation.email}</TableCell>
                  <TableCell>{format(new Date(donation.date), 'PP')}</TableCell>
                  <TableCell className="text-right font-medium">{donation.amount.toFixed(2)} Birr</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
