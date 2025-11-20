import { useState } from 'react';
import { usePlans, useDeletePlan } from '@/hooks/usePlans';
import type { IPlan } from '@/types';
import { AdminPlansGrid } from './AdminPlansGridProps ';
import { UpdatePlanDialog } from './UpdatePlanDialog';

export default function AdminPlansPage() {
  const { data: plans, isLoading } = usePlans();
  const deletePlanMutation = useDeletePlan();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);

  const handleDelete = (id: string) => {
    deletePlanMutation.mutate(id);
  };

  const handleUpdate = (plan: IPlan) => {
    setSelectedPlan(plan);
    setUpdateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading plans...</p>
      </div>
    );
  }

  return (
    <>
      <AdminPlansGrid plans={plans || []} onDelete={handleDelete} onUpdate={handleUpdate} />
      <UpdatePlanDialog
        plan={selectedPlan}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
    </>
  );
}
