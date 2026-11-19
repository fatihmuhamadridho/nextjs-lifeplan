'use client';

import { useState } from 'react';
import { Alert, NumberInput, TextInput, Textarea } from '@mantine/core';
import { PlanDialog } from '@features/Plan/views/components/PlanDialog';
import { CmsDialog } from '@components/CmsDialog';
import type { Goal } from '@core/Goal/domain/goal.interface';
import { useCreateGoal, useUpdateGoal } from '@core/Goal/infrastructure/goal.hook';

type GoalDialogProps = {
  mode: 'add-goal' | 'edit-goal' | 'add-plan';
  onClose: () => void;
  goal?: Goal;
  initialGoal?: string;
};

export function GoalDialog({ mode, goal, initialGoal, onClose }: GoalDialogProps) {
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const [title, setTitle] = useState(goal?.title ?? '');
  const [description, setDescription] = useState(goal?.description ?? '');
  const [progress, setProgress] = useState<number | string>(goal?.progress ?? 0);
  const [color, setColor] = useState(goal?.color ?? '#14c8a0');
  const [error, setError] = useState('');

  if (mode === 'add-plan') return <PlanDialog mode="add-plan" initialGoal={initialGoal} onClose={onClose} />;

  const isEdit = mode === 'edit-goal';
  const mutation = isEdit ? updateGoal : createGoal;

  return (
    <CmsDialog
      title={isEdit ? 'Edit Goal' : 'Add Goal'}
      description={isEdit ? 'Update this goal.' : 'Create a mid-term goal connected to your life vision.'}
      actionLabel={isEdit ? 'Save Changes' : 'Create Goal'}
      onClose={onClose}
      onSubmit={() => {
        const amount = Number(progress);
        if (!title.trim() || !Number.isFinite(amount) || amount < 0 || amount > 100) {
          setError('Enter a title and progress between 0 and 100.');
          return;
        }
        setError('');
        const input = { title: title.trim(), description: description.trim(), progress: amount, color };
        const onSuccess = () => onClose();
        if (isEdit && goal)
          updateGoal.mutate(
            { id: goal.id, input },
            { onSuccess, onError: () => setError('Unable to save this goal. Try again.') }
          );
        else createGoal.mutate(input, { onSuccess, onError: () => setError('Unable to create this goal. Try again.') });
      }}
    >
      {error && <Alert color="red">{error}</Alert>}
      <TextInput label="Goal title" required value={title} onChange={(event) => setTitle(event.currentTarget.value)} />
      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        minRows={3}
      />
      <NumberInput label="Progress (%)" min={0} max={100} value={progress} onChange={setProgress} />
      <TextInput label="Color" type="color" value={color} onChange={(event) => setColor(event.currentTarget.value)} />
      {mutation.isPending && <Alert color="blue">Saving goal…</Alert>}
    </CmsDialog>
  );
}
