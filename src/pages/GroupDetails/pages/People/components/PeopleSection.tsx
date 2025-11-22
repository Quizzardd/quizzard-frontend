import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PersonCard from './PersonCard';
import type { IGroupMemberDetailed } from '@/services/groupService';

interface PeopleSectionProps {
  title: string;
  count: number;
  people: IGroupMemberDetailed[];
  role: 'teacher' | 'student';
  groupId: string;
}

function PeopleSection({ title, count, people, role, groupId }: PeopleSectionProps) {
  return (
    <Card className="p-0">
      <CardHeader className="p-4 bg-muted/50 hover:bg-muted/50 items-center border-b-2">
        <CardTitle className="font-semibold">{title}</CardTitle>
        <CardDescription>
          {count} {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {people.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No {title.toLowerCase()} yet</div>
        ) : (
          <div className="divide-y divide-border">
            {people.map((member) => (
              <PersonCard key={member._id} member={member} role={role} groupId={groupId} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default PeopleSection;
