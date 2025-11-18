import { Users, BookOpen, Clock, ShieldCheck, GraduationCap } from 'lucide-react';
import InviteStudentsModal from './InviteStudentsModal';
import LeaveGroupDialog from './LeaveGroupDialog';
import { useState } from 'react';
import type { IGroupOwner } from '@/types/groups';

export interface GroupCardProps {
  title: string;
  owner: IGroupOwner;
  coverUrl?: string;
  membersCount?: number;
  modulesCount?: number;
  joinedAt: string;
  inviteCode?: string;
  role: 'teacher' | 'student';
}

export default function GroupCard({
  title,
  owner,
  coverUrl,
  membersCount,
  modulesCount,
  inviteCode,
  joinedAt,
  role,
}: GroupCardProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [showLeave, setShowLeave] = useState(false);

  // const inviteCode = 'ABC123'; // temporary dummy code — will come from API later
  const isTeacher = role === 'teacher';

  // Get owner name - handle both string and object
  const ownerName = `${owner.firstName} ${owner.lastName}`;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Top Cover Image + Role Badge */}
      <div className="relative">
        <img
          src={coverUrl || '/placeholder.png'}
          className="object-cover w-full h-40 md:h-48 transition-transform duration-300 hover:scale-105"
        />

        {/* Role Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow-sm 
            ${isTeacher ? 'bg-black text-white' : 'bg-white text-blue-600 '}
          `}
        >
          <div className="flex items-center gap-1 font-medium">
            {isTeacher ? (
              <ShieldCheck className="w-3 h-3" />
            ) : (
              <GraduationCap className="w-3 h-3" />
            )}
            {isTeacher ? 'Teacher' : 'Student'}
          </div>
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-5">
        {/* Title & Owner */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">By Dr. {ownerName}</p>
        </div>

        {/* Members + Modules */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {membersCount} Members
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            {modulesCount} Modules
          </div>
        </div>

        {/* Joined Date Badge */}
        <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary font-medium py-3 px-3 rounded-lg">
          <Clock className="w-3 h-3" />
          Joined {new Date(joinedAt).toLocaleDateString()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          {/* Open Group */}
          <button className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Open Group
          </button>

          {/* Role-Based Action */}
          {isTeacher ? (
            <button
              className="w-full bg-secondary text-secondary-foreground font-medium py-2 rounded-lg hover:bg-[var(--secondary-hover)] transition cursor-pointer"
              onClick={() => setShowInvite(true)}
            >
              Invite
            </button>
          ) : (
            <button
              className="w-full border border-destructive text-destructive font-medium py-2 rounded-lg hover:bg-destructive/10 cursor-pointer"
              onClick={() => setShowLeave(true)}
            >
              Leave
            </button>
          )}
        </div>
      </div>
      {/* Modals */}
      {isTeacher && (
        <InviteStudentsModal
          open={showInvite}
          onClose={() => setShowInvite(false)}
          inviteCode={inviteCode}
        />
      )}

      <LeaveGroupDialog
        open={showLeave}
        onClose={() => setShowLeave(false)}
        onConfirm={() => console.log('Leaving group...')}
      />
    </div>
  );
}
