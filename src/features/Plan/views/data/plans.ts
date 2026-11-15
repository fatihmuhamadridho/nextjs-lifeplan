export type PlanStatus = 'In Progress' | 'Completed' | 'On Hold' | 'Not Started';

export type PlanItem = {
  name: string;
  goal: string;
  timeline: string;
  progress: number;
  weeks: number;
  tasks: number;
  focus: string;
  status: PlanStatus;
};

export const plans: PlanItem[] = [
  {
    name: 'Build E-Commerce Business',
    goal: 'Build Passive Income',
    timeline: 'Jan 2026 – Dec 2027',
    progress: 62,
    weeks: 14,
    tasks: 32,
    focus: 'Week 40 - Setup online store',
    status: 'In Progress',
  },
  {
    name: 'Grow to 10K Monthly Visitors',
    goal: 'Build Passive Income',
    timeline: 'Jan 2027 – Dec 2027',
    progress: 20,
    weeks: 8,
    tasks: 18,
    focus: 'SEO foundational keywords',
    status: 'In Progress',
  },
  {
    name: 'Half Marathon Training Program',
    goal: 'Stay Healthy and Active',
    timeline: 'Jul 2026 – Nov 2026',
    progress: 75,
    weeks: 16,
    tasks: 28,
    focus: 'Zone 2 Long run (14km this week)',
    status: 'In Progress',
  },
  {
    name: 'Learn Spanish to Conversational',
    goal: 'Be a Global Citizen',
    timeline: 'Jan 2026 – Jun 2026',
    progress: 100,
    weeks: 12,
    tasks: 24,
    focus: 'Final review & conversation practice',
    status: 'Completed',
  },
  {
    name: 'Plan Japan Trip',
    goal: 'Explore the World',
    timeline: 'Mar 2026 – Apr 2026',
    progress: 45,
    weeks: 6,
    tasks: 12,
    focus: 'Book accommodation in Tokyo',
    status: 'In Progress',
  },
  {
    name: 'Read 24 Books This Year',
    goal: 'Continual Learning',
    timeline: 'Jan 2026 – Dec 2026',
    progress: 30,
    weeks: 24,
    tasks: 36,
    focus: 'Read Chapter 6 (The Psychology...)',
    status: 'In Progress',
  },
  {
    name: 'Build Dream Home',
    goal: 'Create Dream Lifestyle',
    timeline: 'Jan 2026 – Dec 2028',
    progress: 10,
    weeks: 8,
    tasks: 20,
    focus: 'Research architects and get quotes',
    status: 'On Hold',
  },
  {
    name: 'Start a Family',
    goal: 'Build a Happy Family',
    timeline: 'Jan 2027 – Dec 2028',
    progress: 0,
    weeks: 4,
    tasks: 8,
    focus: 'Define next steps and timeline',
    status: 'Not Started',
  },
];

export const weeklyPlans = [
  { week: 'Week 39', dateRange: '19 – 25 Sep 2026', progress: 75 },
  { week: 'Week 40', dateRange: '26 Sep – 02 Oct 2026', progress: 62 },
  { week: 'Week 41', dateRange: '03 – 09 Oct 2026', progress: 0 },
  { week: 'Week 42', dateRange: '10 – 16 Oct 2026', progress: 0 },
];

export const planGoals = [...new Set(plans.map((plan) => plan.goal))];
