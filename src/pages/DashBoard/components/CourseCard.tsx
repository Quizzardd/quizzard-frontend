import { memo } from 'react';
import type { IGroup } from '@/types';

interface CourseCardProps {
  course: IGroup;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-card overflow-hidden rounded-xl shadow hover:shadow-md transition">
      {course.coverUrl && (
        <img
          src={course.coverUrl}
          alt={course.title}
          className="w-full h-28 object-cover rounded-lg mb-3"
        />
      )}
      <p className="font-medium text-foreground">{course.title}</p>
      <p className="text-sm text-muted-foreground">
        {course.description || 'No description provided.'}
      </p>
      {/* Optional: show owner if populated */}
      {typeof course.owner !== 'string' && 'firstname' in course.owner && (
        <p className="text-xs text-muted-foreground mt-1">
          {/* Teacher: {course.owner.firstname} {course.owner.lastname} */}
        </p>
      )}
    </div>
  );
}

export default memo(CourseCard);
