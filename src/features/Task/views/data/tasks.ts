export type Task = {
  id: number;
  title: string;
  plan: string;
  due: string | null;
  priority: string;
  current: number;
  target: number;
  successThreshold: number;
  reachedAt: string | null;
  week?: string;
};
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'Failed';
export const taskStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Completed', 'Failed'];
export const taskStatusColors = { 'To Do': 'gray', 'In Progress': 'blue', Completed: 'teal', Failed: 'red' };
export function taskProgress(task: Task) {
  return task.target > 0 ? (task.current / task.target) * 100 : 0;
}
export function taskStatus(task: Task, now = new Date()): TaskStatus {
  const deadline = task.due ? new Date(`${task.due}T23:59:59.999`).getTime() : Infinity;
  const reached = taskProgress(task) >= task.successThreshold;
  if (reached && task.reachedAt && new Date(task.reachedAt).getTime() <= deadline) return 'Completed';
  if (now.getTime() > deadline) return 'Failed';
  return reached ? 'Completed' : task.current > 0 ? 'In Progress' : 'To Do';
}
export function updateTaskProgress(task: Task, patch: Partial<Task>, now = new Date()): Task {
  const updated = { ...task, ...patch };
  updated.reachedAt =
    taskProgress(updated) >= updated.successThreshold
      ? ((updated.target === task.target && updated.successThreshold === task.successThreshold
          ? task.reachedAt
          : null) ?? now.toISOString())
      : null;
  return updated;
}
const baseTasks: Task[] = [
  {
    id: 1,
    title: 'Finish freelance proposal',
    plan: 'Build E-Commerce Business',
    due: '2026-09-26',
    priority: 'High',
    current: 0,
    target: 10,
    successThreshold: 40,
    reachedAt: null,
    week: 'Week 40',
  },
  {
    id: 2,
    title: 'Gym workout session',
    plan: 'Half Marathon Training Program',
    due: '2026-09-26',
    priority: 'Medium',
    current: 5,
    target: 10,
    successThreshold: 40,
    reachedAt: '2026-09-26T12:00:00',
    week: 'Week 40',
  },
  {
    id: 4,
    title: 'Plan content for e-commerce',
    plan: 'Build E-Commerce Business',
    due: '2026-09-28',
    priority: 'Medium',
    current: 0,
    target: 10,
    successThreshold: 40,
    reachedAt: null,
    week: 'Week 40',
  },
  {
    id: 5,
    title: 'Research SEO keywords',
    plan: 'Grow to 10K Monthly Visitors',
    due: '2026-09-29',
    priority: 'Low',
    current: 0,
    target: 10,
    successThreshold: 40,
    reachedAt: null,
    week: 'Week 40',
  },
];

const weekTasks = [
  {
    week: 'Week 39',
    titles: [
      'Research target audience',
      'Compare e-commerce platforms',
      'Define product catalog',
      'Review supplier proposals',
    ],
    completed: 3,
  },
  {
    week: 'Week 40',
    titles: [
      'Create store account',
      'Choose storefront theme',
      'Configure product categories',
      'Upload product photos',
      'Write product descriptions',
      'Configure shipping options',
      'Test checkout flow',
      'Plan content for e-commerce',
    ],
    completed: 5,
  },
  { week: 'Week 41', titles: ['Publish the online store', 'Prepare launch campaign'], completed: 0 },
  { week: 'Week 42', titles: ['Review launch performance', 'Improve product pages'], completed: 0 },
].flatMap(({ week, titles, completed }) =>
  titles.map((title, index) => ({
    id: 100 + Number(week.slice(5)) * 10 + index,
    week,
    title,
    plan: 'Build E-Commerce Business',
    due: (
      { 'Week 39': '2026-09-25', 'Week 40': '2026-10-02', 'Week 41': '2026-10-09', 'Week 42': '2026-10-16' } as Record<
        string,
        string
      >
    )[week],
    priority: 'Medium',
    current: index < completed ? 5 : 0,
    target: 10,
    successThreshold: 40,
    reachedAt: index < completed ? '2026-09-20T12:00:00' : null,
  }))
);

export const initialTasks: Task[] = [
  ...baseTasks,
  ...weekTasks.filter((task) => !baseTasks.some((item) => item.title === task.title)),
];
