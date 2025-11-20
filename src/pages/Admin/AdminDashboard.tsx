import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, CreditCard, Activity } from 'lucide-react';
import type { IPlan } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useDailyLoginStats, usePlatformOverview } from '@/hooks/useAdmin';
import { useAdminGroups } from '@/hooks/useAdmin';
import { usePlans } from '@/hooks/usePlans';

export function AdminDashboard() {
  const { data: overview, isLoading: overviewLoading } = usePlatformOverview();
  const { data: loginStats, isLoading: statsLoading } = useDailyLoginStats({ limit: 30 });
  const { data: groups } = useAdminGroups();
  const { data: plans } = usePlans();

  // Transform login stats for the chart
  const activityData =
    loginStats?.stats.map((stat) => ({
      date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      logins: stat.totalLogins,
      uniqueUsers: stat.uniqueUsers,
    })) || [];

  const stats = [
    {
      title: 'Total Users',
      count: overview?.totalUsers || 0,
      icon: <Users className="w-6 h-6 text-secondary-foreground" />,
      subtitle: `${overview?.activeUsers || 0} active`,
    },
    {
      title: 'Total Groups',
      count: groups?.length || 0,
      icon: <BookOpen className="w-6 h-6 text-secondary-foreground" />,
      subtitle: 'All groups',
    },
    {
      title: "Today's Logins",
      count: overview?.todayLogins || 0,
      icon: <Activity className="w-6 h-6 text-secondary-foreground" />,
      subtitle: 'Active today',
    },
    {
      title: 'Total Plans',
      count: plans?.length || 0,
      icon: <CreditCard className="w-6 h-6 text-secondary-foreground" />,
      subtitle: `${plans?.filter((plan: { isActive: boolean }) => plan.isActive).length || 0} active`,
    },
  ];

  if (overviewLoading || statsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-card text-card-foreground border border-border shadow-none transition-colors hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
                <p className="font-bold text-2xl mt-1">{stat.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-muted-foreground">{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Activity Chart */}
      <Card className="bg-card text-card-foreground border border-border shadow-none transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-lg font-semibold">Platform Activity</p>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days login statistics</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">Total Logins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                <span className="text-muted-foreground">Unique Users</span>
              </div>
            </div>
          </div>

          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--foreground)" fontSize={12} />
                <YAxis stroke="var(--foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="logins"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Total Logins"
                />
                <Line
                  type="monotone"
                  dataKey="uniqueUsers"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Unique Users"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No activity data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
