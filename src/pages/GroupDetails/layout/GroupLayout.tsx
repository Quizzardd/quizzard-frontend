import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';

export const CompleteTabTrigger = ({
  value,
  children,
  path,
}: {
  value: string;
  children: React.ReactNode;
  path?: string;
}) => {
  const navigate = useNavigate();

  const handleClick = ({ path }: { path?: string }) => {
    if (path) {
      navigate(path, { relative: 'path' });
    }
  };
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-0 border-b-2  h-full data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
      onClick={() => handleClick({ path })}
    >
      {children}
    </TabsTrigger>
  );
};

export default function GroupLayout({
  tabs,
  Header,
}: {
  tabs: { value: string; label: string; path?: string }[];
  Header: React.FC;
}) {
  return (
    <div>
      <Header />
      <Tabs defaultValue="announcements" className="w-full border-0 bg-background">
        <TabsList className="w-full p-0 bg-background justify-start border-b h-13 rounded-none">
          {tabs?.map((tab) => (
            <CompleteTabTrigger key={tab.value} value={tab.value} path={tab.path}>
              {tab?.label}
            </CompleteTabTrigger>
          ))}
        </TabsList>
        <div className="p-6">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
