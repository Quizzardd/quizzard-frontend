import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PersonCard from './PersonCard';
interface Person {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface PeopleSectionProps {
  title: string;
  count: number;
  people: Person[];
}

function PeopleSection({ title, count, people }: PeopleSectionProps) {
  return (
    <Card className="p-0 ">
      <CardHeader className="p-4 bg-muted/50 hover:bg-muted/50 items-center border-b-2">
        <CardTitle className="font-semibold">{title}</CardTitle>
        <CardDescription>
          {count} {title.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default PeopleSection;
