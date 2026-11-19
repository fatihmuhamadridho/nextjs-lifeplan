'use client';

import { useState } from 'react';
import { Alert, NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CmsDialog } from '@components/CmsDialog';
import { useCreateWeek, useDuplicateWeek, useListWeeks, useUpdateWeek } from '@core/Plan/infrastructure/plan.hook';
import type { Week } from '@core/Plan/domain/plan.interface';

export function WeekDialog({
  planId,
  week,
  duplicate = false,
  onClose,
}: {
  planId: string;
  week?: Week;
  duplicate?: boolean;
  onClose: () => void;
}) {
  const weeksQuery = useListWeeks({ planId });
  const createWeek = useCreateWeek();
  const updateWeek = useUpdateWeek();
  const duplicateWeek = useDuplicateWeek();
  const isEdit = Boolean(week) && !duplicate;
  const nextNumber = Math.max(0, ...(weeksQuery.data?.data ?? []).map((item) => Number(item.week.slice(5)))) + 1;
  const dateOffset = duplicate && week ? (nextNumber - Number(week.week.slice(5))) * 7 : 0;
  const shiftedDate = (value?: string) =>
    value ? new Date(Date.parse(value) + dateOffset * 86_400_000).toISOString().slice(0, 10) : null;
  const [number, setNumber] = useState<string | number>(isEdit && week ? Number(week.week.slice(5)) : nextNumber);
  const [start, setStart] = useState<string | null>(() => shiftedDate(week?.start));
  const [end, setEnd] = useState<string | null>(() => shiftedDate(week?.end));
  const [error, setError] = useState('');
  const mutation = duplicate ? duplicateWeek : isEdit ? updateWeek : createWeek;
  const close = () => {
    if (!mutation.isPending) onClose();
  };

  return (
    <CmsDialog
      title={duplicate ? `Duplicate ${week?.week ?? 'Week'}` : isEdit ? 'Edit Week' : 'Add Week'}
      description={
        duplicate
          ? 'Copy all tasks into a new week. Progress resets to 0 and status is automatic. Task due dates shift with the new schedule.'
          : 'Set the week number and schedule.'
      }
      actionLabel={
        mutation.isPending ? 'Saving...' : duplicate ? 'Duplicate Week' : isEdit ? 'Save Changes' : 'Add Week'
      }
      onClose={close}
      onSubmit={() => {
        if (mutation.isPending) return;
        if (!start || !end || end < start || !Number.isInteger(Number(number)) || Number(number) < 1) {
          setError('Enter a valid week number and date range.');
          return;
        }
        const label = `Week ${number}`;
        if ((weeksQuery.data?.data ?? []).some((item) => (!isEdit || item.id !== week?.id) && item.week === label)) {
          setError('This week number already exists.');
          return;
        }
        setError('');
        const input = { planId, week: label, start, end };
        const options = {
          onSuccess: onClose,
          onError: () => setError('Unable to save this week. Try again.'),
        };
        if (duplicate && week) duplicateWeek.mutate({ id: week.id, input }, options);
        else if (isEdit && week) updateWeek.mutate({ id: week.id, input }, options);
        else createWeek.mutate(input, options);
      }}
    >
      {error && <Alert color="red">{error}</Alert>}
      {weeksQuery.isError && <Alert color="red">Unable to load existing weeks.</Alert>}
      {mutation.isPending && <Alert color="blue">Saving week…</Alert>}
      <NumberInput
        label="Week number"
        required
        min={1}
        allowDecimal={false}
        value={number}
        onChange={setNumber}
        disabled={mutation.isPending}
      />
      <DatePickerInput
        label="Start date"
        required
        value={start}
        onChange={setStart}
        placeholder="Select start date"
        disabled={mutation.isPending}
      />
      <DatePickerInput
        label="End date"
        required
        value={end}
        onChange={setEnd}
        minDate={start ?? undefined}
        placeholder="Select end date"
        disabled={mutation.isPending}
      />
    </CmsDialog>
  );
}
