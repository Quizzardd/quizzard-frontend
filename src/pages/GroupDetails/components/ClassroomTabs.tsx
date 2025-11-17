import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const CompleteTabTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <TabsTrigger
    value={value}
    className="rounded-none border-0 border-b-2  h-full data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
  >
    {children}
  </TabsTrigger>
);

export default function ClassroomTabs() {
  return (
    <Tabs defaultValue="announcements" className="w-full border-0 bg-background">
      <TabsList className="w-full p-0 bg-background justify-start border-b h-13 rounded-none">
        <CompleteTabTrigger value="announcements">Announcements</CompleteTabTrigger>
        <CompleteTabTrigger value="classwork">Classwork</CompleteTabTrigger>
        <CompleteTabTrigger value="people">People</CompleteTabTrigger>
        <CompleteTabTrigger value="grades">Grades</CompleteTabTrigger>
      </TabsList>

      <TabsContent value="announcements">Announcements content…</TabsContent>
      <TabsContent value="classwork">Classwork content…</TabsContent>
      <TabsContent value="people">People content…</TabsContent>
      <TabsContent value="grades">Grades content…</TabsContent>
    </Tabs>
  );
}
