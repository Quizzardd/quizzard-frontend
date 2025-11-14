import { Card, CardContent } from "@/components/ui/card";
import { Users, Book, FileText, CreditCard } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DashboardProps = {
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
  activeSubscriptions: number;
  activityData: { date: string; logins: number; newCourses: number }[];
};

export function AdminDashboard({
  studentsCount,
  teachersCount,
  coursesCount,
  activeSubscriptions,
  activityData,
}: DashboardProps) {
  const stats = [
    {
      title: "Students",
      count: studentsCount,
      icon: <Users className="w-6 h-6 text-secondary-foreground" />,
    },
    {
      title: "Teachers",
      count: teachersCount,
      icon: <Book className="w-6 h-6 text-secondary-foreground" />,
    },
    {
      title: "Courses",
      count: coursesCount,
      icon: <FileText className="w-6 h-6 text-secondary-foreground" />,
    },
    {
      title: "Active Subscriptions",
      count: activeSubscriptions,
      icon: <CreditCard className="w-6 h-6 text-secondary-foreground" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-card text-card-foreground border border-border shadow-none transition-colors hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
                <p className="font-bold text-lg">{stat.count}</p>
              </div>
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Activity Chart */}
      <Card className="bg-card text-card-foreground border border-border shadow-none transition-colors">
        <CardContent>
          <p className="text-lg font-semibold mb-4">Platform Activity</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--foreground)" />
              <YAxis stroke="var(--foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="newCourses"
                stroke="var(--secondary)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
