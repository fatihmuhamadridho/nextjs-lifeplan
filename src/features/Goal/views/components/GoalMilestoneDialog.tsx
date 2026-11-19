'use client';

import { useState } from 'react';
import { Alert, NumberInput, TextInput } from '@mantine/core';
import { CmsDialog } from '@components/CmsDialog';
import type { Milestone as GoalMilestone } from '@core/Goal/domain/goal.interface';
import { useUpdateMilestone } from '@core/Goal/infrastructure/goal.hook';

export function GoalMilestoneDialog({
  goalId,
  milestone,
  onClose,
}: {
  goalId: string;
  milestone: GoalMilestone;
  onClose: () => void;
}) {
  const updateMilestone = useUpdateMilestone();
  const [title, setTitle] = useState(milestone.title);
  const [timeline, setTimeline] = useState(milestone.timeline);
  const [progress, setProgress] = useState<number | string>(milestone.progress);
  const [error, setError] = useState('');

  return (
    <CmsDialog
      title="Edit Milestone"
      description="Update this goal milestone."
      actionLabel="Save Changes"
      onClose={onClose}
      onSubmit={() => {
        if (!title.trim() || !timeline.trim() || Number(progress) < 0 || Number(progress) > 100) {
          setError('Enter a title, timeline, and progress from 0 to 100.');
          return;
        }
        updateMilestone.mutate(
          {
            goalId,
            id: milestone.id,
            input: { title: title.trim(), timeline: timeline.trim(), progress: Number(progress) },
          },
          { onSuccess: onClose, onError: () => setError('Unable to save this milestone.') }
        );
      }}
    >
      {error && <Alert color="red">{error}</Alert>}
      <TextInput label="Title" value={title} onChange={(event) => setTitle(event.currentTarget.value)} required />
      <TextInput
        label="Timeline"
        value={timeline}
        onChange={(event) => setTimeline(event.currentTarget.value)}
        required
      />
      <NumberInput label="Progress (%)" value={progress} onChange={setProgress} min={0} max={100} />
      {updateMilestone.isPending && <Alert color="blue">Saving milestone…</Alert>}
    </CmsDialog>
  );
}
