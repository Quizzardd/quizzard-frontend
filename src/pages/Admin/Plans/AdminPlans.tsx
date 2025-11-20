import type { IPlan } from '@/types';
import type { JSX } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AdminPlanCardProps {
  plan: IPlan;
  onDelete: (id: string) => void;
  onUpdate: (plan: IPlan) => void;
}

export function AdminPlanCard({ plan, onDelete, onUpdate }: AdminPlanCardProps): JSX.Element {
  const isPlus = plan.name.toLowerCase().includes('plus');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(plan._id.toString());
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <motion.div
        key={plan._id.toString()}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`
        relative flex flex-col justify-between
        rounded-2xl border bg-card text-card-foreground shadow-sm 
        transition-all duration-300 hover:shadow-xl hover:border-primary/50 
        dark:hover:shadow-primary/10
        ${plan.isActive ? 'border-primary ring-1 ring-primary/30' : 'border-border'}
      `}
      >
        {/* Popular Badge */}
        {isPlus && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary animate__animated animate__fadeIn">
            ⭐ Most Popular
          </span>
        )}

        {/* Header */}
        <div className="p-6">
          <h3 className="text-xl font-semibold capitalize tracking-tight">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.credits} credits / month</p>
        </div>

        {/* Body */}
        <div className="flex flex-col grow px-6 pb-6 space-y-4">
          <div>
            <p className="text-3xl font-bold text-primary">
              {plan.price ? `$${plan.price.toFixed(2)}/mo` : 'Free'}
            </p>
            {plan.description && (
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            )}
          </div>

          {plan.feature?.length > 0 && (
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {plan.feature.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Admin Actions */}
          <div className="mt-auto pt-6 flex gap-3">
            <Button
              variant="destructive"
              className="flex-1 hover:scale-105 transition-transform"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              className="flex-1 hover:border-primary hover:text-primary transition-colors"
              onClick={() => onUpdate(plan)}
            >
              Update
            </Button>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {plan.name} Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{plan.name}" plan. Users subscribed to this plan may
              be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
