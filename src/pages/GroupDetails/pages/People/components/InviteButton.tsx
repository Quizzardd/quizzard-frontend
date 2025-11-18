import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface InviteButtonProps {
  onClick?: () => void;
}

function InviteButton({ onClick }: InviteButtonProps) {
  return (
    <Button onClick={onClick} className="gap-2" size="lg">
      <UserPlus className="w-5 h-5" />
      Invite Students
    </Button>
  );
}
export default InviteButton;
