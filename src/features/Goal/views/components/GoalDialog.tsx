'use client';

import { PlanDialog } from '@features/Plan/views/components/PlanDialog';
import { CmsDialog } from '@components/CmsDialog';
import { MonthPickerInput } from '@mantine/dates';

type GoalDialogProps = {
  mode: 'add-goal' | 'edit-goal' | 'add-plan';
  onClose: () => void;
};

export function GoalDialog({ mode, onClose }: GoalDialogProps) {
  if (mode === 'add-plan') return <PlanDialog mode="add-plan" onClose={onClose} />;
  const isEdit = mode === 'edit-goal';

  return (
    <CmsDialog
      title={isEdit ? 'Edit Goal' : 'Add Goal'}
      description={
        isEdit ? 'Update this goal and its target horizon.' : 'Create a mid-term goal connected to your life vision.'
      }
      actionLabel={isEdit ? 'Save Changes' : 'Create Goal'}
      onClose={onClose}
      onSubmit={onClose}
    >
      <label>
        Goal Title *
        <input
          required
          defaultValue={isEdit ? 'Build Passive Income' : undefined}
          placeholder="e.g. Build Passive Income Portfolio"
        />
      </label>
      <label>
        Description <span>(optional)</span>
        <textarea placeholder="Briefly describe what achieving this looks like..." />
      </label>
      <MonthPickerInput label="Target Horizon" defaultValue="2030-12-01" valueFormat="MMM YYYY" />
    </CmsDialog>
  );
}
