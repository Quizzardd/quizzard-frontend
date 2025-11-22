import {
  Users,
  BookOpen,
  Clock,
  ShieldCheck,
  GraduationCap,
  MoreVertical,
  Edit,
  Archive,
  Trash2,
} from 'lucide-react';
import InviteStudentsModal from './InviteStudentsModal';
import LeaveGroupDialog from './LeaveGroupDialog';
import EditGroupModal from './EditGroupModal';
import DeleteGroupDialog from './DeleteGroupDialog';
import ArchiveGroupDialog from './ArchiveGroupDialog';
import { useState } from 'react';
import type { IGroupOwner } from '@/types/groups';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export interface GroupCardProps {
  groupId: string;
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
  groupId,
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
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const navigate = useNavigate();
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
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium shadow-sm 
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

        {/* Three-dot menu for teachers */}
        {isTeacher && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-white/90 hover:bg-white shadow-sm cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowEdit(true)} className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowArchive(true)} className="cursor-pointer">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Group
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDelete(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
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
          <button
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            onClick={() => navigate(`/groups/${groupId}`)}
          >
            Open Group
          </button>

          {/* Role-Based Action */}
          {isTeacher ? (
            <button
              className="w-full bg-secondary text-secondary-foreground font-medium py-2 rounded-lg hover:bg-(--secondary-hover) transition cursor-pointer"
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
        <>
          <InviteStudentsModal
            open={showInvite}
            onClose={() => setShowInvite(false)}
            inviteCode={inviteCode}
          />
          <EditGroupModal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            groupId={groupId}
            currentTitle={title}
            currentCoverUrl={coverUrl}
          />
          <DeleteGroupDialog
            open={showDelete}
            onClose={() => setShowDelete(false)}
            groupId={groupId}
            groupTitle={title}
          />
          <ArchiveGroupDialog
            open={showArchive}
            onClose={() => setShowArchive(false)}
            groupId={groupId}
            groupTitle={title}
          />
        </>
      )}

      {!isTeacher && (
        <LeaveGroupDialog
          open={showLeave}
          onClose={() => setShowLeave(false)}
          groupId={groupId}
          groupTitle={title}
        />
      )}
    </div>
  );
}
