'use client';

import { useState } from 'react';
import { CmsDialog } from '@components/CmsDialog';
import { DatePickerInput } from '@mantine/dates';
import { TextInput, Textarea } from '@mantine/core';

export function PlanDialog({ mode, onClose }: { mode: 'add-plan' | 'edit-plan' | 'add-week'; onClose: () => void }) {
  const [week, setWeek] = useState(43);
  const isWeek = mode === 'add-week';
  const isEdit = mode === 'edit-plan';
  const [startDate, setStartDate] = useState<string | null>(isEdit ? '2026-01-01' : null);
  const [endDate, setEndDate] = useState<string | null>(isEdit ? '2027-12-31' : null);
  const [submitted, setSubmitted] = useState(false);
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
        if (isWeek || datesValid) onClose();
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
            defaultValue={isEdit ? 'Build E-Commerce Business' : undefined}
            placeholder="e.g. Build E-Commerce Business"
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
        </>
      )}
    </CmsDialog>
  );
}
