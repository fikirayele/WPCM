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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { departments as initialDepartments } from '@/lib/data';
import type { Department, User } from '@/lib/types';
import { ArrowUpDown, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function UserActions() {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [departments] = useState<Department[]>(initialDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  const sortedUsers = useMemo(() => {
    let sortableItems = [...users];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [users, sortConfig]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedUsers, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as User['role'];
    const departmentId = formData.get('departmentId') as string | undefined;
    const active = formData.get('active') === 'on';

    if (currentUser) {
      updateUser(currentUser.id, { fullName, email, role, departmentId: role === 'consultant' ? departmentId : undefined, active });
      toast({
        title: 'User Updated',
        description: `"${fullName}" has been successfully updated.`,
      });
    } else {
        const userPayload = {
            fullName,
            email,
            role,
            departmentId: role === 'consultant' ? departmentId : undefined,
            active,
        }
        addUser(userPayload);
        toast({
            title: 'User Added',
            description: `"${fullName}" has been successfully added.`,
        });
    }
    setIsDialogOpen(false);
    setCurrentUser(null);
  };

  const handleDelete = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    deleteUser(userId);
    toast({
      title: 'User Deleted',
      description: `"${user?.fullName}" has been deleted.`,
      variant: 'destructive',
    });
  };

  const getDepartmentName = (id?: string) =>
    departments.find((d) => d.id === id)?.name || 'N/A';

  const getRoleVariant = (role: string) => {
    if (role === 'admin') return 'default';
    if (role === 'consultant') return 'secondary';
    return 'outline';
  };

  const UserForm = ({
    aUser,
    deps,
  }: {
    aUser: User | null;
    deps: Department[];
  }) => {
    const [role, setRole] = useState(aUser?.role || 'student');

    return (
      <form onSubmit={handleSave}>
        <DialogHeader>
          <DialogTitle className="font-headline">
            {aUser ? 'Edit' : 'Add'} User
          </DialogTitle>
          <DialogDescription>
            {aUser
              ? 'Update the details for this user.'
              : 'Create a new user account.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={aUser?.fullName}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={aUser?.email}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              name="role"
              defaultValue={aUser?.role || 'student'}
              onValueChange={(value) => setRole(value as User['role'])}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === 'consultant' && (
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="departmentId" className="text-right">
                Department
              </Label>
              <Select name="departmentId" defaultValue={aUser?.departmentId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {deps.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id}>
                      {dep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="active" className="text-right">
              Active
            </Label>
            <Switch
              id="active"
              name="active"
              defaultChecked={aUser?.active ?? true}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentUser(null)}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <UserForm aUser={currentUser} deps={departments} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('fullName')}>
                  Name <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('role')}>
                  Role <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('active')}>
                  Status <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getRoleVariant(user.role)}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.role === 'consultant'
                    ? getDepartmentName(user.departmentId)
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? 'secondary' : 'destructive'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentUser(user);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will
                            permanently delete the user account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing{' '}
          {Math.min(
            (currentPage - 1) * rowsPerPage + 1,
            filteredUsers.length
          )}{' '}
          to {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of{' '}
          {filteredUsers.length} entries
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${rowsPerPage}`}
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
