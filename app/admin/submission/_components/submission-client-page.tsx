'use client';

import { useState } from 'react';
import { resetUserSubmissions } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SubmissionClientPage({
  users,
  totalQuestions,
}: {
  users: any[];
  totalQuestions: number;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleReset = async (userId: number) => {
    setLoading((prev) => ({ ...prev, [userId]: true }));
    const { success, message } = await resetUserSubmissions(userId);
    if (success) {
      toast({
        title: 'Success',
        description: message,
      });
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
    setLoading((prev) => ({ ...prev, [userId]: false }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Attempted: {user.submissionCount} / {totalQuestions}
                </p>
              </div>
              <Button
                onClick={() => handleReset(user.id)}
                disabled={loading[user.id]}
              >
                {loading[user.id] ? 'Resetting...' : 'Reset Submissions'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}