import CreateModuleButton from './components/CreateModuleButton';
import CreateQuizButton from './components/CreateQuizButton';
import ModuleCard from './components/ModuleCard';
import { useModulesByGroup } from '@/hooks/useModule';
import { useParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const Classwork = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: modules, isLoading, error } = useModulesByGroup(groupId!);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreateModuleButton groupId={groupId!} />
        <CreateQuizButton groupId={groupId!} />
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive text-sm">Failed to load modules. Please try again.</p>
          </div>
        ) : modules && modules.length > 0 ? (
          modules.map((module) => <ModuleCard key={module._id} module={module} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No modules or quizzes yet. Get started by adding a module or creating a quiz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classwork;
