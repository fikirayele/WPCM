'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function DonationsPage() {
    const { donations } = useAuth();

  return (
    <div className="space-y-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-primary">Donation Management</h1>
          <p className="text-muted-foreground">Review and verify submitted donations.</p>
        </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Submitted Donations</CardTitle>
          <CardDescription>
            A list of all manual donation submissions for verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Screenshot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.name}</TableCell>
                  <TableCell>{donation.phoneNumber}</TableCell>
                  <TableCell>{format(new Date(donation.date), 'PPp')}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{donation.transactionId}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{donation.amount.toFixed(2)} Birr</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Transaction Screenshot</DialogTitle>
                                <DialogDescription>
                                    Transaction ID: {donation.transactionId}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 rounded-lg border bg-muted p-2">
                                <div className="relative h-[60vh] w-full">
                                    <Image 
                                        src={donation.screenshotUrl} 
                                        alt={`Screenshot for ${donation.transactionId}`} 
                                        fill 
                                        className="object-contain rounded-md"
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
