'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface InviteStudentsModalProps {
  open: boolean;
  onClose: () => void;
  inviteCode?: string;
}

export default function InviteStudentsModal({
  open,
  onClose,
  inviteCode,
}: InviteStudentsModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Invite Students</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-2">
          Share this code with students to join the group.
        </p>

        <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-lg border">
          <span className="font-mono font-medium">{inviteCode}</span>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            variant="secondary"
            className="w-full hover:bg-[var(--secondary-hover)] transition"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
