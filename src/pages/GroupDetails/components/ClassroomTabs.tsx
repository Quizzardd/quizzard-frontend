import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const CompleteTabTrigger = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => (
  <TabsTrigger
    value={value}
    className="rounded-none border-0 border-b-2  h-full data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
  >
    {children}
  </TabsTrigger>
);

export default function ClassroomTabs({
  tabs,
}: {
  tabs: { value: string; label: string; children: React.ReactNode }[];
}) {
  return (
    <Tabs defaultValue="announcements" className="w-full border-0 bg-background">
      <TabsList className="w-full p-0 bg-background justify-start border-b h-13 rounded-none">
        {tabs?.map((tab) => (
          <CompleteTabTrigger key={tab.value} value={tab.value}>
            {tab?.label}
          </CompleteTabTrigger>
        ))}
      </TabsList>
      {tabs?.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
