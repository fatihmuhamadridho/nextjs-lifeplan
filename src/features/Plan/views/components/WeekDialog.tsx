'use client';
import { useState } from 'react';
import { NumberInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CmsDialog } from '@components/CmsDialog';
import { useTasks } from '@features/Task/views/data/taskStore';
import { useWeeks, type WeekPlan } from '../data/weekStore';

export function WeekDialog({ week, onClose }: { week?: WeekPlan; onClose: () => void }) {
  const [weeks, setWeeks] = useWeeks();
  const [, setTasks] = useTasks();
  const [number, setNumber] = useState<string | number>(
    week ? Number(week.week.slice(5)) : Math.max(0, ...weeks.map((item) => Number(item.week.slice(5)))) + 1
  );
  const [start, setStart] = useState<string | null>(week?.start ?? null);
  const [end, setEnd] = useState<string | null>(week?.end ?? null);
  const [error, setError] = useState('');
  return (
    <CmsDialog
      title={week ? 'Edit Week' : 'Add Week'}
      description="Set the week number and schedule for this plan."
      actionLabel={week ? 'Save Changes' : 'Add Week'}
      onClose={onClose}
      onSubmit={() => {
        if (!start || !end || end < start || !Number.isInteger(Number(number)) || Number(number) < 1) {
          setError('Enter a valid week number and date range.');
          return;
        }
        const label = `Week ${number}`;
        if (weeks.some((item) => item.id !== week?.id && item.week === label)) {
          setError('This week number already exists.');
          return;
        }
        const updated = { id: week?.id ?? `week-${Date.now()}`, week: label, start, end };
        if (week)
          setTasks((items) =>
            items.map((task) =>
              task.plan === 'Build E-Commerce Business' && task.week === week.week ? { ...task, week: label } : task
            )
          );
        setWeeks((items) => (week ? items.map((item) => (item.id === week.id ? updated : item)) : [...items, updated]));
        onClose();
      }}
    >
      <NumberInput
        label="Week number"
        required
        min={1}
        allowDecimal={false}
        value={number}
        onChange={setNumber}
        error={error || undefined}
      />
      <DatePickerInput label="Start date" required value={start} onChange={setStart} placeholder="Select start date" />
      <DatePickerInput
        label="End date"
        required
        value={end}
        onChange={setEnd}
        minDate={start ?? undefined}
        placeholder="Select end date"
      />
    </CmsDialog>
  );
}
