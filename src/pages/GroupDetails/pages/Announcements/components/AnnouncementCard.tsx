import { Card, CardContent } from '@/components/ui/card';

export default function AnnouncementCard() {
  return (
    <Card className="flex gap-4 p-4 items-start rounded-xl shadow-sm">
      <div className="flex-shrink-0 flex items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" // replace with your image URL
          alt="Instructor"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-lg">Dr. Sarah Johnson</p>
          <p className="text-sm text-muted-foreground">2 hours ago</p>
        </div>
      </div>

      <CardContent className="p-0 flex flex-col gap-1">
        {/* Message */}
        <p className="text-sm mt-2">
          Welcome to Object-Oriented Programming! Our first module starts next week. Please review
          the syllabus and complete the introduction quiz.
        </p>
      </CardContent>
    </Card>
  );
}
