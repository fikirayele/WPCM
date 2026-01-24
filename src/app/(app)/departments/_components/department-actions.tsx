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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { departments as initialDepartments } from '@/lib/data';
import type { Department } from '@/lib/types';
import { ArrowUpDown, PlusCircle, Pencil, Trash2 } from 'lucide-react';

export function DepartmentActions() {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Department;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sortedDepartments = useMemo(() => {
    let sortableItems = [...departments];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [departments, sortConfig]);

  const filteredDepartments = useMemo(() => {
    return sortedDepartments.filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedDepartments, searchTerm]);

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDepartments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDepartments, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);

  const requestSort = (key: keyof Department) => {
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
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (currentDepartment) {
      setDepartments(
        departments.map((d) =>
          d.id === currentDepartment.id ? { ...d, name, description } : d
        )
      );
      toast({
        title: 'Department Updated',
        description: `"${name}" has been successfully updated.`,
      });
    } else {
      const newDepartment: Department = {
        id: `dept-${Date.now()}`,
        name,
        description,
      };
      setDepartments([...departments, newDepartment]);
      toast({
        title: 'Department Added',
        description: `"${name}" has been successfully added.`,
      });
    }
    setIsDialogOpen(false);
    setCurrentDepartment(null);
  };

  const handleDelete = (departmentId: string) => {
    const department = departments.find((d) => d.id === departmentId);
    setDepartments(departments.filter((d) => d.id !== departmentId));
    toast({
      title: 'Department Deleted',
      description: `"${department?.name}" has been deleted.`,
      variant: 'destructive',
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentDepartment(null)}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle className="font-headline">
                  {currentDepartment ? 'Edit' : 'Add'} Department
                </DialogTitle>
                <DialogDescription>
                  {currentDepartment
                    ? 'Update the details for this department.'
                    : 'Create a new department for consultants.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={currentDepartment?.name}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentDepartment?.description}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('name')}>
                  Name
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort('description')}
                >
                  Description
                  <ArrowUpDown className="w-4 h-4 ml-2" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCurrentDepartment(department);
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
                            permanently delete the department.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(department.id)}
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
            filteredDepartments.length
          )}{' '}
          to {Math.min(currentPage * rowsPerPage, filteredDepartments.length)}{' '}
          of {filteredDepartments.length} entries
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
