import type  { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatusCard({ title, value, icon }: StatusCardProps) {
  return (
    <div className="bg-card p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
      <div>
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
}
