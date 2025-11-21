import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import MaterialItem from './MaterialItem';
import QuizItem from './QuizItem';
import type { IWeek } from '@/types/weeks';

interface WeekCardProps {
  week: IWeek;
}

export default function WeekCard({ week }: WeekCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-l-2 border-border pl-4">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
          <h3 className="font-medium text-base">{week.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
            + Material
          </Button>
          <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
            + Quiz
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-8 space-y-2 mt-2">
          {/* Materials */}
          <MaterialItem
            material={{
              _id: '1',
              title: 'Intro to OOP (PDF)',
              type: 'pdf',
              group: week.group as string,
              week: week._id,
              url: 'https://example.com/intro.pdf',
              createdAt: new Date(),
            }}
          />
          <MaterialItem
            material={{
              _id: '2',
              title: 'Video: Understanding Classes',
              type: 'video',
              group: week.group as string,
              week: week._id,
              url: 'https://example.com/video',
              createdAt: new Date(),
            }}
          />

          {/* Quiz */}
          <QuizItem
            quiz={{
              _id: '1',
              title: 'Java Basics Quiz',
              state: 'published',
              group: week.group as string,
              week: week._id,
              createdBy: 'teacher-id',
              createdAt: new Date(),
            }}
          />
        </div>
      )}
    </div>
  );
}
