'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { emailUser } from '@/actions/admin';

interface EmailUserDialogProps {
  userEmail: string;
  userName: string;
}

export function EmailUserDialog({
  userEmail,
  userName,
}: EmailUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!subject || !content) {
      toast({
        title: 'Error',
        description: 'Subject and content are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSending(true);
      const response = await emailUser({
        email: userEmail,
        subject,
        content,
      });

      if (response.success) {
        toast({
          title: 'Email Sent',
          description: `Email sent to ${userName} successfully`,
          variant: 'success',
        });
        setIsOpen(false);
        setSubject('');
        setContent('');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to send email',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while sending the email',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm">
          <Mail className="h-4 w-4 mr-1" />
          Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Email to {userName}</DialogTitle>
          <DialogDescription>
            Compose and send an email directly to {userEmail}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="subject"
              className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="content"
              className="text-right">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSendEmail}
            disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}