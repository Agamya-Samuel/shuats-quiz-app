'use client';

import {
  AlertTriangle,
  Download,
  Globe,
  Loader2,
  Mail,
  Search,
  Shield,
  Upload,
  UserCheck,
  UserPlus,
  UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteUserWithNotification, getUsers } from '@/actions/admin';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  school: string;
  branch: string;
  rollno: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  address?: {
    city: string | null;
    state: string | null;
    country: string | null;
  } | null;
}

// Add termination reasons
const TERMINATION_REASONS = {
  existing_student: 'Existing SHUATS students are not allowed to register',
  duplicate_account: 'Duplicate Account',
  fake_information: 'Provided fake or incorrect information',
  policy_violation: 'Violation of platform policies',
  inappropriate_behavior: 'Inappropriate behavior or misconduct',
  other: 'Other reasons',
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getUsers();

      if (response.success && response.users) {
        setUsers(response.users);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load users',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!selectedReason) {
      toast({
        title: 'Error',
        description: 'Please select a reason for account termination',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsDeleting(userId);
      const user = users.find((u) => u.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      const response = await deleteUserWithNotification(
        userId,
        user.email,
        user.name,
        TERMINATION_REASONS[selectedReason as keyof typeof TERMINATION_REASONS],
      );

      if (response.success) {
        setUsers(users.filter((u) => u.id !== userId));
        toast({
          title: 'User Deleted',
          description: 'The user has been deleted and notified via email',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete user',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the user',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
      setSelectedReason('');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.mobile &&
        user.mobile.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.rollno.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
            </div>
            <Button
              onClick={loadUsers}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
            >
              Refresh List
            </Button>
          </div>

          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.school}</TableCell>
                    <TableCell>{user.branch}</TableCell>
                    <TableCell>{user.rollno}</TableCell>
                    <TableCell>
                      {user.address ? (
                        <>
                          {user.address.city && (
                            <span>{user.address.city}, </span>
                          )}
                          {user.address.state && (
                            <span>{user.address.state}, </span>
                          )}
                          {user.address.country && (
                            <span>{user.address.country}</span>
                          )}
                        </>
                      ) : (
                        'No location data'
                      )}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting === user.id}>
                            {isDeleting === user.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete User Account
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete the user
                              account and send a termination notice. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Label
                              htmlFor="termination-reason"
                              className="mb-2 block">
                              Select Termination Reason
                            </Label>
                            <Select
                              value={selectedReason}
                              onValueChange={setSelectedReason}>
                              <SelectTrigger
                                id="termination-reason"
                                className="w-full">
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(TERMINATION_REASONS).map(
                                  ([key, value]) => (
                                    <SelectItem
                                      key={key}
                                      value={key}>
                                      {value}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setSelectedReason('')}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={
                                !selectedReason || isDeleting === user.id
                              }>
                              {isDeleting === user.id
                                ? 'Deleting...'
                                : 'Delete Account'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-6 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {filteredUsers.map((user, index) => (
              <Card
                key={user.id}
                className="p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="flex justify-between">
                      <p className="font-medium">{user.name}</p>
                      <p className="font-medium">#{index + 1}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Mobile</p>
                    <p className="text-sm text-muted-foreground">
                      {user.mobile}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">School</p>
                    <p className="text-sm text-muted-foreground">
                      {user.school}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Branch</p>
                    <p className="text-sm text-muted-foreground">
                      {user.branch}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Roll No</p>
                    <p className="text-sm text-muted-foreground">
                      {user.rollno}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {user.address ? (
                        <>
                          {user.address.city && (
                            <span>{user.address.city}, </span>
                          )}
                          {user.address.state && (
                            <span>{user.address.state}, </span>
                          )}
                          {user.address.country && (
                            <span>{user.address.country}</span>
                          )}
                        </>
                      ) : (
                        'No location data'
                      )}
                    </p>
                  </div>
                  <div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          disabled={isDeleting === user.id}>
                          {isDeleting === user.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete the user account
                            and send a termination notice. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Label
                            htmlFor="termination-reason-mobile"
                            className="mb-2 block">
                            Select Termination Reason
                          </Label>
                          <Select
                            value={selectedReason}
                            onValueChange={setSelectedReason}>
                            <SelectTrigger
                              id="termination-reason-mobile"
                              className="w-full">
                              <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(TERMINATION_REASONS).map(
                                ([key, value]) => (
                                  <SelectItem
                                    key={key}
                                    value={key}>
                                    {value}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setSelectedReason('')}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={
                              !selectedReason || isDeleting === user.id
                            }>
                            {isDeleting === user.id
                              ? 'Deleting...'
                              : 'Delete Account'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
