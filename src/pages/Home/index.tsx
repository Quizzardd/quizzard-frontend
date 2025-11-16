import React from "react";
import { BookOpen, Brain, ClipboardList, Users } from "lucide-react";
import type { IUser, IGroup } from "@/types";

// Dummy user and courses (replace later with React Query)
const user: IUser = {
  _id: "1",
  firstname: "Omar",
  lastname: "Wael",
  email: "omar@example.com",
  role: "user",
  tokenBalance: 120,
  createdAt: new Date(),
};

const studentCourses= [
  {
    _id: "1",
    title: "Math Fundamentals",
    description: "Learn algebra, geometry, and equations",
    status: "active",
  },
  {
    _id: "2",
    title: "English Grammar Mastery",
    description: "Master tenses, vocabulary, and writing",
    status: "active",
  },
  {
    _id: "3",
    title: "Physics Basics",
    description: "Understand forces, motion, and energy",
    status: "completed",
  },
];

// ----------------------
// 🧱 Reusable Components
// ----------------------
interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtext?: string;
}
function StatusCard({ icon, title, value, subtext }: StatusCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  );
}

function CourseCard({ title, description, status }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            status === "active"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "active" ? "In Progress" : "Completed"}
        </span>
      </div>
    </div>
  );
}

// ----------------------
// 🏠 Main Page
// ----------------------
export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user.firstname}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here’s what’s happening in your classroom today.
        </p>
      </header>

      {/* Status Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Courses"
          value={studentCourses.length}
          subtext="Joined classes"
        />
        <StatusCard
          icon={<Brain className="h-5 w-5" />}
          title="AI Tokens"
          value={user.tokenBalance}
          subtext="Remaining this month"
        />
        <StatusCard
          icon={<ClipboardList className="h-5 w-5" />}
          title="Quizzes Generated"
          value={28}
          subtext="This month"
        />
        <StatusCard
          icon={<Users className="h-5 w-5" />}
          title="Groups"
          value={3}
          subtext="Active now"
        />
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Your Courses</h2>
          <button className="text-sm text-primary hover:underline">
            View All
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studentCourses.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
// import React from 'react';
// import { BookOpen, Brain, ClipboardList, Users } from 'lucide-react';
// import type { IUser, IGroup } from '@/types';

// // Dummy user and courses (replace later with React Query)
// const user: IUser = {
//   _id: '1',
//   firstname: 'Omar',
//   lastname: 'Wael',
//   email: 'omar@example.com',
//   role: 'user',
//   tokenBalance: 120,
//   createdAt: new Date(),
// };

// const studentCourses: IGroup[] = [
//   {
//     _id: '1',
//     name: 'Math Fundamentals',
//     description: 'Learn algebra, geometry, and equations',
//     status: 'active',
//   },
//   {
//     _id: '2',
//     name: 'English Grammar Mastery',
//     description: 'Master tenses, vocabulary, and writing',
//     status: 'active',
//   },
//   {
//     _id: '3',
//     name: 'Physics Basics',
//     description: 'Understand forces, motion, and energy',
//     status: 'completed',
//   },
// ];

// // ----------------------
// // 🧱 Reusable Components
// // ----------------------
// interface StatusCardProps {
//   icon: React.ReactNode;
//   title: string;
//   value: string | number;
//   subtext?: string;
// }
// function StatusCard({ icon, title, value, subtext }: StatusCardProps) {
//   return (
//     <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition">
//       <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
//       <div>
//         <p className="text-sm text-muted-foreground">{title}</p>
//         <p className="text-lg font-semibold text-foreground">{value}</p>
//         {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
//       </div>
//     </div>
//   );
// }

// function CourseCard({ name, description, status }: IGroup) {
//   return (
//     <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
//       <div>
//         <h3 className="text-lg font-semibold text-foreground">{name}</h3>
//         <p className="text-sm text-muted-foreground">{description}</p>
//       </div>
//       <div className="mt-4">
//         <span
//           className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
//             status === 'active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
//           }`}
//         >
//           {status === 'active' ? 'In Progress' : 'Completed'}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ----------------------
// // 🏠 Main Page
// // ----------------------
// export default function Home() {
//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <header>
//         <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.firstname}! 👋</h1>
//         <p className="text-sm text-muted-foreground mt-1">
//           Here’s what’s happening in your classroom today.
//         </p>
//       </header>

//       {/* Status Cards */}
//       <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatusCard
//           icon={<BookOpen className="h-5 w-5" />}
//           title="Courses"
//           value={studentCourses.length}
//           subtext="Joined classes"
//         />
//         <StatusCard
//           icon={<Brain className="h-5 w-5" />}
//           title="AI Tokens"
//           value={user.tokenBalance}
//           subtext="Remaining this month"
//         />
//         <StatusCard
//           icon={<ClipboardList className="h-5 w-5" />}
//           title="Quizzes Generated"
//           value={28}
//           subtext="This month"
//         />
//         <StatusCard
//           icon={<Users className="h-5 w-5" />}
//           title="Groups"
//           value={3}
//           subtext="Active now"
//         />
//       </section>

//       {/* Courses Section */}
//       <section>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-foreground">Your Courses</h2>
//           <button className="text-sm text-primary hover:underline">View All</button>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {studentCourses.map((course) => (
//             <CourseCard key={course._id} {...course} />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
