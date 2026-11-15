'use client';
import { useEffect, useSyncExternalStore } from 'react';

export type WeekPlan = { id: string; week: string; start: string; end: string };
const initialWeeks: WeekPlan[] = [39, 40, 41, 42].map((number, index) => ({
  id: `week-${number}`,
  week: `Week ${number}`,
  start: ['2026-09-19', '2026-09-26', '2026-10-03', '2026-10-10'][index],
  end: ['2026-09-25', '2026-10-02', '2026-10-09', '2026-10-16'][index],
}));
let weeks = initialWeeks;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function weekDateRange(week: WeekPlan) {
  const format = (date: string) =>
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(`${date}T00:00:00`)
    );
  return `${format(week.start)} - ${format(week.end)}`;
}
export function useWeeks() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => weeks,
    () => initialWeeks
  );
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('lifeplan-weeks-v1') ?? 'null');
      if (
        Array.isArray(saved) &&
        saved.every(
          (item) =>
            typeof item.id === 'string' &&
            /^Week \d+$/.test(item.week) &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.start) &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.end) &&
            item.end >= item.start
        )
      )
        weeks = saved;
    } catch {
      /* Use initial weeks if storage is unavailable. */
    }
    emit();
  }, []);
  const setWeeks = (update: (current: WeekPlan[]) => WeekPlan[]) => {
    weeks = update(weeks);
    try {
      localStorage.setItem('lifeplan-weeks-v1', JSON.stringify(weeks));
    } catch {
      /* Keep session changes. */
    }
    emit();
  };
  return [snapshot, setWeeks] as const;
}
