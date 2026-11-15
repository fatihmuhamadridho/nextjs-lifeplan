'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { plans as initialPlans, type PlanItem } from './plans';

const key = 'lifeplan-plans-v1';
let plans = initialPlans;
let loaded = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function usePlans() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => plans,
    () => initialPlans
  );

  useEffect(() => {
    if (!loaded) {
      loaded = true;
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
        if (
          Array.isArray(saved) &&
          saved.every(
            (plan) =>
              typeof plan.name === 'string' &&
              typeof plan.goal === 'string' &&
              typeof plan.timeline === 'string' &&
              Number.isFinite(plan.progress) &&
              Number.isFinite(plan.weeks) &&
              Number.isFinite(plan.tasks) &&
              typeof plan.focus === 'string' &&
              ['In Progress', 'Completed', 'On Hold', 'Not Started'].includes(plan.status)
          )
        ) {
          plans = saved;
        }
      } catch {
        // Keep the bundled plans if saved data is unavailable or invalid.
      }
      emit();
    }
  }, []);

  const setPlans = (update: PlanItem[] | ((current: PlanItem[]) => PlanItem[])) => {
    plans = typeof update === 'function' ? update(plans) : update;
    try {
      localStorage.setItem(key, JSON.stringify(plans));
    } catch {
      // Keep the in-memory update when browser storage is unavailable.
    }
    emit();
  };

  return [snapshot, setPlans] as const;
}
