import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

interface Person {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// Data

interface PersonCardProps {
  person: Person;
}

function PersonCard({ person }: PersonCardProps) {
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 px-6 py-3 hover:bg-muted/50 transition-colors">
      <Avatar className="w-12 h-12">
        <AvatarImage className="rounded-full" src={person.avatar} alt={person.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium text-foreground">{person.name}</h3>
        <p className="text-sm text-muted-foreground">{person.email}</p>
      </div>
    </div>
  );
}
export default PersonCard;
