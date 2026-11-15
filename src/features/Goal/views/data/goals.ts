export type GoalItem = {
  title: string;
  description: string;
  progress: number;
  color: string;
};

export const goals: GoalItem[] = [
  {
    title: 'Build Passive Income',
    description: 'Real estate dividends & high-yield digital portfolios',
    progress: 42,
    color: '#14c8a0',
  },
  {
    title: 'Stay Healthy and Active',
    description: 'Sub-15% body fat, mobility training & marathon run',
    progress: 68,
    color: '#ff9b98',
  },
  {
    title: 'Provide the Best for Family',
    description: 'Primary residence purchase & college trust establishment',
    progress: 55,
    color: '#ffc985',
  },
  {
    title: 'Grow Career / Business',
    description: 'Scale consultancy agency to $1.2M ARR',
    progress: 73,
    color: '#a6b8ff',
  },
  { title: 'Travel the World', description: 'Visit 30 countries across 4 continents', progress: 28, color: '#a6b8ff' },
  {
    title: 'Personal Development',
    description: 'Fluency in Japanese, complete 150 non-fiction books',
    progress: 61,
    color: '#a6b8ff',
  },
  {
    title: 'Help Others',
    description: 'Mentor 50 young entrepreneurs & fund community clinic',
    progress: 35,
    color: '#ffc985',
  },
];

export const goalMilestones = [
  { title: 'Build E-Commerce Business', timeline: '2026 – 2027', progress: 60 },
  { title: 'Grow to 10K Monthly Visitors', timeline: '2027', startDate: 'Jan 2027', endDate: 'Dec 2027', progress: 20 },
  { title: 'Reach $1K Monthly Revenue', timeline: '2027 – 2028', progress: 0 },
  { title: 'Scale to Multiple Products', timeline: '2028 – 2030', progress: 0 },
  { title: 'Automate & Delegate Operations', timeline: '2028 – 2030', progress: 0 },
];
