'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadFileType } from '@/db/schema';

import { User } from './user-management';

interface UserDetailsDialogProps {
  user: User;
  uploads: UploadFileType[];
}

export function UserDetailsDialog({ user, uploads }: UserDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Badge variant="secondary">Name</Badge>
              <p>{user.name}</p>
            </div>
            <div>
              <Badge variant="secondary">Email</Badge>
              <p>{user.email}</p>
            </div>
            <div>
              <Badge variant="secondary">Mobile</Badge>
              <p>{user.mobile}</p>
            </div>
            <div>
              <Badge variant="secondary">School</Badge>
              <p>{user.school}</p>
            </div>
            <div>
              <Badge variant="secondary">Branch</Badge>
              <p>{user.branch}</p>
            </div>
            <div>
              <Badge variant="secondary">Location</Badge>
              <p>
                {user.address
                  ? `${user.address.city}, ${user.address.state}, ${user.address.country}`
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <Badge variant="secondary">Document Status</Badge>
            {uploads && uploads.length > 0 ? (
              <ul className="list-disc pl-5 mt-2">
                {uploads.map((upload) => (
                  <li
                    key={upload.id}
                    className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">
                        {upload.documentType}:
                      </span>{' '}
                      {upload.verified ? (
                        <span className="text-green-600">Verified</span>
                      ) : upload.rejected ? (
                        <span className="text-red-600">
                          Rejected ({upload.rejectionReason})
                        </span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(upload.fileUrl, '_blank')}>
                      View Document
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                No document upload status available.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
