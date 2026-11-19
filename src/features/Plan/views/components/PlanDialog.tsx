'use client';

import { useState } from 'react';
import { Alert, Select, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CmsDialog } from '@components/CmsDialog';
import type { Plan as PlanItem, PlanStatus } from '@core/Plan/domain/plan.interface';
import { useListGoals } from '@core/Goal/infrastructure/goal.hook';
import { useCreatePlan, useUpdatePlan } from '@core/Plan/infrastructure/plan.hook';

const planStatuses: PlanStatus[] = ['In Progress', 'Completed', 'On Hold', 'Not Started'];

type PlanDialogProps = {
  mode: 'add-plan' | 'edit-plan';
  onClose: () => void;
  plan?: PlanItem;
  initialGoal?: string;
};

function dateInputFromLabel(value?: string) {
  if (!value) return null;
  const parsed = new Date(`${value} 1`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function monthLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function PlanDialog({ mode, onClose, plan, initialGoal }: PlanDialogProps) {
  const isEdit = mode === 'edit-plan';
  const goalsQuery = useListGoals({ archived: false });
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const [startDate, setStartDate] = useState<string | null>(() => {
    const start = plan?.timeline.split('–')[0]?.trim();
    return dateInputFromLabel(start);
  });
  const [endDate, setEndDate] = useState<string | null>(() => {
    const end = plan?.timeline.split('–')[1]?.trim();
    return dateInputFromLabel(end);
  });
  const [name, setName] = useState(plan?.name ?? '');
  const [goal, setGoal] = useState(initialGoal ?? plan?.goal ?? '');
  const [focus, setFocus] = useState(plan?.focus ?? '');
  const [status, setStatus] = useState<PlanStatus>(plan?.status ?? 'Not Started');
  const [error, setError] = useState('');
  const datesValid = Boolean(startDate && endDate && endDate >= startDate);
  const mutation = isEdit ? updatePlan : createPlan;

  return (
    <CmsDialog
      title={isEdit ? 'Edit Plan' : 'Add Plan'}
      description={isEdit ? 'Update this plan.' : 'Create a plan under one of your active goals.'}
      actionLabel={isEdit ? 'Save Changes' : 'Create Plan'}
      onClose={onClose}
      onSubmit={() => {
        if (!name.trim() || !goal || !datesValid) {
          setError('Enter a name, choose an active goal, and select a valid date range.');
          return;
        }
        setError('');
        const input = {
          name: name.trim(),
          goal,
          timeline: `${monthLabel(startDate!)} – ${monthLabel(endDate!)}`,
          progress: plan?.progress ?? 0,
          weeks: plan?.weeks ?? 0,
          tasks: plan?.tasks ?? 0,
          focus: focus.trim(),
          status,
        };
        const options = {
          onSuccess: onClose,
          onError: () => setError('Unable to save this plan. Check that its goal is active and try again.'),
        };
        if (isEdit && plan) updatePlan.mutate({ id: plan.id, input }, options);
        else createPlan.mutate(input, options);
      }}
    >
      {error && <Alert color="red">{error}</Alert>}
      {goalsQuery.isError && <Alert color="red">Unable to load active goals.</Alert>}
      <TextInput
        label="Plan title"
        required
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        placeholder="e.g. Build E-Commerce Business"
      />
      <Select
        label="Goal"
        required
        data={(goalsQuery.data?.data ?? []).map((item) => ({ value: item.title, label: item.title }))}
        value={goal}
        onChange={(value) => setGoal(value ?? '')}
        searchable
        disabled={Boolean(initialGoal)}
        placeholder="Select an active goal"
        nothingFoundMessage="No active goals found"
      />
      <TextInput
        label="Focus"
        value={focus}
        onChange={(event) => setFocus(event.currentTarget.value)}
        placeholder="What will this plan focus on?"
      />
      <DatePickerInput
        label="Start date"
        required
        placeholder="Select start date"
        value={startDate}
        onChange={setStartDate}
        valueFormat="D MMM YYYY"
      />
      <DatePickerInput
        label="End date"
        required
        placeholder="Select end date"
        value={endDate}
        onChange={setEndDate}
        minDate={startDate ?? undefined}
        valueFormat="D MMM YYYY"
      />
      <Select
        label="Status"
        data={planStatuses}
        value={status}
        onChange={(value) => value && setStatus(value as PlanStatus)}
        allowDeselect={false}
      />
      {mutation.isPending && <Alert color="blue">Saving plan…</Alert>}
    </CmsDialog>
  );
}
