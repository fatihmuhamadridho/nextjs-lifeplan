import type { Week } from '@core/Plan/domain/plan.interface';

export function weekDateRange(week: Week) {
  const format = (date: string) =>
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(`${date}T00:00:00`)
    );
  return `${format(week.start)} - ${format(week.end)}`;
}
