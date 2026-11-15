'use client';

import { DatePickerInput } from '@mantine/dates';
import { IconCalendarEvent } from '@tabler/icons-react';

export function CmsDatePicker() {
  return (
    <DatePickerInput
      aria-label="Select date"
      defaultValue="2026-09-26"
      valueFormat="ddd, D MMM YYYY"
      leftSection={<IconCalendarEvent size={16} />}
    />
  );
}
