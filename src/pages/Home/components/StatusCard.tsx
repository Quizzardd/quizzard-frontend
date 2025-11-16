import {  useUserStats } from '@/hooks/useUser';
import { BookOpen, GraduationCap, Sparkles, Layers } from 'lucide-react';

export default function StatusCards() {
  //const { data: user } = useGetMe();
  const { data: stats, isLoading } = useUserStats();

  const cards = [
    {
      title: 'Teaching Courses',
      value: stats?.teachingCourses ?? 0,
      icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Enrolled Courses',
      value: stats?.enrolledCourses ?? 0,
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
    },
    {
      title: 'AI Tokens Remaining',
      value: 88,
      icon: <Sparkles className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Total Courses',
      value: (stats?.teachingCourses ?? 0) + (stats?.enrolledCourses ?? 0),
      icon: <Layers className="w-6 h-6 text-primary" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm animate-pulse"
          >
            <div className="h-5 w-24 bg-muted rounded"></div>
            <div className="mt-3 h-6 w-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <p className="text-2xl font-semibold">{card.value}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">{card.icon}</div>
        </div>
      ))}
    </div>
  );
}
