'use client';

import { CmsBreadcrumbs } from '@components/CmsBreadcrumbs';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { goals } from '@features/Goal/views/data/goals';
import { plans } from '@features/Plan/views/data/plans';
import { taskStatus } from '@features/Task/views/data/tasks';
import { useTasks } from '@features/Task/views/data/taskStore';
import { TaskActions } from '@features/Task/views/components/TaskActions';
import { TaskStatusBadge } from '@features/Task/views/components/TaskProgress';
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {
  IconActivity,
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconTarget,
  IconStar,
  IconArrowRight,
} from '@tabler/icons-react';
import styles from './Dashboard.module.css';
import { DashboardSidebar } from '@components/DashboardSidebar';
import { DashboardNavbar } from '@components/DashboardNavbar';

export function DashboardTemplate({
  userName,
  avatarSrc,
  avatarLabel,
}: {
  userName: string;
  avatarSrc?: string;
  avatarLabel: string;
}) {
  const [active, setActive] = useState('Dashboard');
  const router = useRouter();
  const [tasks] = useTasks();
  const completed = tasks.filter((task) => taskStatus(task) === 'Completed').length;
  const taskRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const goalProgress = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;
  const completedPlans = plans.filter((plan) => plan.status === 'Completed').length;
  const activePlans = plans.filter((plan) => plan.status === 'In Progress');
  const pendingTasks = tasks
    .filter((task) => ['To Do', 'In Progress'].includes(taskStatus(task)))
    .sort((a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999'));
  const topGoals = [...goals].sort((a, b) => b.progress - a.progress).slice(0, 4);
  const quickActions = [
    ['View Goals', IconTarget, '/goals'],
    ['View Plans', IconCalendarEvent, '/plans'],
    ['View Tasks', IconCheck, '/tasks'],
  ] as const;
  return (
    <Box className={styles.root}>
      <DashboardSidebar active={active} onNavigate={setActive} />
      <Box className={styles.content}>
        <DashboardNavbar userName={userName} avatarSrc={avatarSrc} avatarLabel={avatarLabel} />
        <main className={styles.main}>
          <CmsBreadcrumbs />
          <section className={styles.stats}>
            <Paper className={styles.stat}>
              <Text className={styles.label}>GOAL PROGRESS</Text>
              <Group justify="space-between">
                <Title order={2}>{goalProgress}%</Title>
                <RingProgress
                  size={62}
                  thickness={6}
                  sections={[{ value: goalProgress, color: 'blue' }]}
                  label={
                    <Text ta="center" size="xs" fw={700}>
                      {goalProgress}%
                    </Text>
                  }
                />
              </Group>
              <Text>
                <IconActivity size={14} /> On track · 5/12 goals
              </Text>
            </Paper>
            <Paper className={styles.stat}>
              <Group justify="space-between">
                <Text className={styles.label}>PLANS COMPLETED</Text>
                <Badge>{plans.length ? Math.round((completedPlans / plans.length) * 100) : 0}%</Badge>
              </Group>
              <Title order={2}>
                {completedPlans} / {plans.length}
              </Title>
              <Progress value={plans.length ? (completedPlans / plans.length) * 100 : 0} />
              <Text>{plans.length - completedPlans} plans remaining</Text>
            </Paper>
            <Paper className={styles.stat}>
              <Group justify="space-between">
                <Text className={styles.label}>TASKS COMPLETED</Text>
                <Badge color="gray">{taskRate}%</Badge>
              </Group>
              <Title order={2}>
                {completed} / {tasks.length}
              </Title>
              <Progress value={taskRate} />
              <Text>{pendingTasks.length} tasks remaining</Text>
            </Paper>
            <Paper className={styles.stat}>
              <Group justify="space-between">
                <Text className={styles.label}>ACTIVE PLANS</Text>
                <Badge color="teal">↗ +12% vs last week</Badge>
              </Group>
              <Title order={2}>{activePlans.length}</Title>
              <Text>
                <IconCheck size={14} /> {plans.filter((plan) => plan.status === 'On Hold').length} on hold ?{' '}
                {plans.filter((plan) => plan.status === 'Not Started').length} not started
              </Text>
            </Paper>
          </section>
          <section className={styles.columns}>
            <Box className={styles.leftColumn}>
              <Paper className={styles.vision}>
                <Group className={styles.cardHeading} justify="space-between">
                  <b>
                    <IconTarget size={16} /> MY BIG VISION
                  </b>
                  <Badge
                    className={styles.visionTarget}
                    color="yellow"
                    variant="light"
                    leftSection={<IconStar size={13} />}
                  >
                    Target: Age 60 (Year 2056)
                  </Badge>
                </Group>
                <Box className={styles.landscape}>
                  <span>Serene Mountain & Ocean Retreat Vision</span>
                </Box>
                <Title order={2}>Financial Freedom at 60</Title>
                <Text>
                  Have enough passive income to live comfortably, travel with family, and help others. Live a healthy
                  and meaningful life.
                </Text>
                <Group className={styles.visionFooter} justify="space-between">
                  <Text>
                    <IconClock size={15} /> 30 Years Journey
                  </Text>
                  <Button variant="light" onClick={() => router.push('/vision')}>
                    View Vision <IconArrowRight size={15} />
                  </Button>
                </Group>
              </Paper>
              <Paper className={styles.weekly}>
                <Group justify="space-between" mb="md">
                  <b>Leading Goals</b>
                  <Button variant="subtle" size="compact-sm" onClick={() => router.push('/goals')}>
                    View All
                  </Button>
                </Group>
                <Stack gap="lg">
                  {topGoals.map((goal) => (
                    <Box key={goal.title}>
                      <Group justify="space-between" mb={8}>
                        <Text fw={600}>{goal.title}</Text>
                        <Text>{goal.progress}%</Text>
                      </Group>
                      <Progress value={goal.progress} />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>
            <Box className={styles.rightColumn}>
              <Paper className={styles.weekCard}>
                <Group justify="space-between">
                  <b>Task Overview</b>
                  <Badge color="gray">{tasks.length} tasks</Badge>
                </Group>
                <Group justify="space-between">
                  <b>{taskRate}% completed</b>
                  <Text>
                    {completed} of {tasks.length} tasks
                  </Text>
                </Group>
                <Progress value={taskRate} />
                <Group className={styles.weekRow}>
                  <IconCheck size={16} />
                  <Text>{completed} completed</Text>
                </Group>
                <Group className={styles.weekRow}>
                  <IconClock size={16} />
                  <Text>
                    {pendingTasks.length} active / {tasks.filter((task) => taskStatus(task) === 'Failed').length} failed
                  </Text>
                </Group>
                <Button fullWidth onClick={() => router.push('/tasks')}>
                  View Tasks <IconArrowRight size={15} />
                </Button>
              </Paper>
              <Paper className={styles.quick}>
                <Text className={styles.label}>QUICK ACTIONS</Text>
                <Box className={styles.quickGrid}>
                  {quickActions.map(([label, Icon, href]) => (
                    <UnstyledButton key={label} onClick={() => router.push(href)}>
                      <Icon size={17} />
                      {label}
                    </UnstyledButton>
                  ))}
                </Box>
              </Paper>
              <Paper className={styles.upcoming}>
                <Group justify="space-between">
                  <b>Pending Tasks</b>
                  <Button variant="subtle" size="compact-sm" onClick={() => router.push('/tasks')}>
                    View All
                  </Button>
                </Group>
                {pendingTasks.length === 0 && (
                  <Text>No active tasks. Review completed and failed tasks on the Tasks page.</Text>
                )}
                {pendingTasks.slice(0, 4).map((task) => (
                  <Box key={task.id} className={styles.task}>
                    <IconClock size={15} />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" fw={600}>
                        {task.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {task.plan}
                      </Text>
                    </Box>
                    <TaskStatusBadge task={task} />
                    <TaskActions task={task} />
                  </Box>
                ))}
              </Paper>
            </Box>
          </section>
        </main>
      </Box>
    </Box>
  );
}
