import React from 'react';
import { Book, CheckCircle, Clock, BarChart2 } from 'lucide-react';
// import StatusCard from './components/StatusCard';
import CourseCard from './components/CourseCard';
import type { IGroup } from '@/types';
const Icons = {
  icon: <Book className="w-6 h-6 text-primary" />,
};
export default function Dashboard() {
  // 🧠 Dummy stats (to be replaced with backend data later)
  const stats = [
    { title: 'Courses Enrolled', value: 5,  },
    { title: 'Quizzes Taken', value: 28, icon: <CheckCircle className="w-6 h-6 text-primary" /> },
    { title: 'Average Score', value: '82%', icon: <BarChart2 className="w-6 h-6 text-primary" /> },
    { title: 'Study Hours', value: 47, icon: <Clock className="w-6 h-6 text-primary" /> },
  ];

  // 🧩 Dummy courses data (for both roles)
  const studentCourses: IGroup[] = [
    {
      _id: '1' ,
      title: 'Introduction to AI',
      description: 'Learn the basics of artificial intelligence and its applications.',
      coverUrl:
        'https://images.unsplash.com/photo-1581092588429-3e73d3368f7c?auto=format&fit=crop&w=800&q=80',
      owner: {
        _id: 't1' ,
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice@edu.com',
        role: 'user',
        tokenBalance: 200,
        createdAt: new Date(),
      },
      createdAt: new Date(),
    },
    {
      _id: '2' ,
      title: 'Data Structures',
      description: 'Understand arrays, linked lists, stacks, and trees.',
      coverUrl:
        'https://images.unsplash.com/photo-1584697964403-4a5b61c76e8e?auto=format&fit=crop&w=800&q=80',
      owner: {
        _id: 't2' ,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@edu.com',
        role: 'user',
        tokenBalance: 180,
        createdAt: new Date(),
      },
      createdAt: new Date(),
    },
  ];

  const teacherCourses: IGroup[] = [
    {
      _id: '3' ,
      title: 'Web Development Bootcamp',
      description: 'HTML, CSS, JavaScript, and React fundamentals.',
      coverUrl:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      owner: {
        _id: 'self' ,
        firstname: 'You',
        lastname: 'Teacher',
        email: 'you@edu.com',
        role: 'user',
        tokenBalance: 100,
        createdAt: new Date(),
      },
      createdAt: new Date(),
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Status Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatusCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div> */}

      {/* Student Courses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Courses as Student</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentCourses.length > 0 ? (
            studentCourses.map((course) => (
              <CourseCard key={course._id.toString()} course={course} />
            ))
          ) : (
            <p className="text-muted-foreground">No enrolled courses.</p>
          )}
        </div>
      </div>

      {/* Teacher Courses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Courses as Teacher</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherCourses.length > 0 ? (
            teacherCourses.map((course) => (
              <CourseCard key={course._id.toString()} course={course} />
            ))
          ) : (
            <p className="text-muted-foreground">You have not created any courses.</p>
          )}
        </div>
      </div>
    </div>
  );
}