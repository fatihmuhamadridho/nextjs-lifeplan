'use client';

import { useState } from 'react';
import { CmsDialog } from '@components/CmsDialog';
import { DatePickerInput } from '@mantine/dates';
import { Select, TextInput, Textarea } from '@mantine/core';
import type { PlanItem, PlanStatus } from '../data/plans';

const planStatuses: PlanStatus[] = ['In Progress', 'Completed', 'On Hold', 'Not Started'];

type PlanDialogProps = {
  mode: 'add-plan' | 'edit-plan' | 'add-week';
  onClose: () => void;
  plan?: PlanItem;
  onSave?: (plan: PlanItem) => void;
};

export function PlanDialog({ mode, onClose, plan, onSave }: PlanDialogProps) {
  const [week, setWeek] = useState(43);
  const isWeek = mode === 'add-week';
  const isEdit = mode === 'edit-plan';
  const [startDate, setStartDate] = useState<string | null>(() => {
    const date = plan?.timeline.split('–')[0]?.trim();
    return date && Number.isFinite(Date.parse(`${date} 1`)) ? new Date(`${date} 1`).toISOString().slice(0, 10) : null;
  });
  const [endDate, setEndDate] = useState<string | null>(() => {
    const date = plan?.timeline.split('–')[1]?.trim();
    return date && Number.isFinite(Date.parse(`${date} 1`)) ? new Date(`${date} 1`).toISOString().slice(0, 10) : null;
  });
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(plan?.name ?? '');
  const [status, setStatus] = useState<PlanStatus>(plan?.status ?? 'Not Started');
  const datesValid = Boolean(startDate && endDate && endDate >= startDate);

  return (
    <CmsDialog
      title={isWeek ? 'Add Week' : isEdit ? 'Edit Plan' : 'Add Plan'}
      description={
        isWeek
          ? 'Schedule a new weekly execution sprint under Build E-Commerce Business.'
          : 'Create a strategic milestone or execution stage for this goal.'
      }
      actionLabel={isWeek ? 'Add Week' : isEdit ? 'Save Changes' : 'Create Plan'}
      onClose={onClose}
      onSubmit={() => {
        setSubmitted(true);
        if (isWeek) {
          onClose();
          return;
        }
        if (datesValid && name.trim()) {
          onSave?.({
            ...(plan ?? {
              goal: 'Build Passive Income',
              progress: 0,
              weeks: 0,
              tasks: 0,
              focus: '',
              status: 'Not Started',
            }),
            name: name.trim(),
            timeline: `${new Date(startDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${new Date(endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
            status,
          });
          onClose();
        }
      }}
    >
      {isWeek ? (
        <>
          <TextInput
            label="Week Number"
            type="number"
            required
            min={1}
            step={1}
            value={week}
            onChange={(event) => setWeek(Number(event.target.value))}
          />
          <DatePickerInput
            type="range"
            label="Date Range"
            required
            placeholder="Select date range"
            valueFormat="D MMM YYYY"
          />
          <Textarea
            label={
              <>
                Weekly Focus / Objective{' '}
                <span style={{ color: '#8392a7', fontSize: 12, fontWeight: 400 }}>(optional)</span>
              </>
            }
            placeholder="e.g. Finalize payment gateway setup and launch initial ad campaign..."
            minRows={3}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Plan Title"
            required
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="e.g. Build E-Commerce Business"
            error={submitted && !name.trim() ? 'Enter a plan title' : undefined}
          />
          <Textarea
            label={
              <>
                Description <span style={{ color: '#8392a7', fontSize: 12, fontWeight: 400 }}>(optional)</span>
              </>
            }
            placeholder="Briefly describe the objective or scope of this milestone..."
            minRows={3}
          />
          <DatePickerInput
            label="Start date"
            required
            placeholder="Select start date"
            value={startDate}
            onChange={setStartDate}
            valueFormat="D MMM YYYY"
            error={submitted && !startDate ? 'Select a start date' : undefined}
          />
          <DatePickerInput
            label="End date"
            required
            placeholder="Select end date"
            value={endDate}
            onChange={setEndDate}
            minDate={startDate ?? undefined}
            valueFormat="D MMM YYYY"
            error={submitted && !datesValid ? 'Select an end date on or after the start date' : undefined}
          />
          <Select
            label="Status"
            data={planStatuses}
            value={status}
            onChange={(value) => {
              if (value) setStatus(value as PlanStatus);
            }}
            allowDeselect={false}
          />
        </>
      )}
    </CmsDialog>
  );
}
