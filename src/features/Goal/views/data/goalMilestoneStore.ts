'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { goalMilestones } from './goals';

export type GoalMilestone = (typeof goalMilestones)[number];

const key = 'lifeplan-goal-milestones-v1';
let milestones: GoalMilestone[] = goalMilestones;
let loaded = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useGoalMilestones() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => milestones,
    () => goalMilestones
  );

  useEffect(() => {
    if (!loaded) {
      loaded = true;
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
        if (
          Array.isArray(saved) &&
          saved.every(
            (item) =>
              typeof item.title === 'string' &&
              typeof item.timeline === 'string' &&
              Number.isFinite(item.progress) &&
              (item.startDate === undefined || typeof item.startDate === 'string') &&
              (item.endDate === undefined || typeof item.endDate === 'string')
          )
        ) {
          milestones = saved;
        }
      } catch {
        // Keep bundled milestones when saved data is unavailable or invalid.
      }
      emit();
    }
  }, []);

  const setMilestones = (update: GoalMilestone[] | ((current: GoalMilestone[]) => GoalMilestone[])) => {
    milestones = typeof update === 'function' ? update(milestones) : update;
    try {
      localStorage.setItem(key, JSON.stringify(milestones));
    } catch {
      // Keep the in-memory update when browser storage is unavailable.
    }
    emit();
  };

  return [snapshot, setMilestones] as const;
}
