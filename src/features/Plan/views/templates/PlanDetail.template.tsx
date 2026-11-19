'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Badge, Box, Button, Group, Menu, Paper, Progress, Text, Title, UnstyledButton } from '@mantine/core';
import { IconBriefcase, IconCalendarEvent, IconChevronDown, IconDotsVertical } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { CmsDialog } from '@components/CmsDialog';
import { PlanDialog } from '../components/PlanDialog';
import { WeekDialog } from '../components/WeekDialog';
import { weekDateRange } from '../utils/weekDateRange';
import type { Week } from '@core/Plan/domain/plan.interface';
import { useListPlans, useListWeeks, useDeletePlan, useDeleteWeek } from '@core/Plan/infrastructure/plan.hook';
import { useListGoals } from '@core/Goal/infrastructure/goal.hook';
import { useTasks } from '@features/Task/views/data/taskStore';
import { taskStatus } from '@features/Task/views/data/tasks';
import { TaskCreateDialog } from '@features/Task/views/components/TaskCreateDialog';
import { TaskProgress, TaskStatusBadge } from '@features/Task/views/components/TaskProgress';
import { TaskActions } from '@features/Task/views/components/TaskActions';
import { PlanOverview } from '../components/PlanOverview';
import styles from './PlanDetail.module.css';

export function PlanDetailTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlanId = searchParams.get('id');
  const plansQuery = useListPlans();
  const goalsQuery = useListGoals();
  const deletePlan = useDeletePlan();
  const deleteWeek = useDeleteWeek();
  const [allTasks] = useTasks();
  const plans = plansQuery.data?.data ?? [];
  const activePlan = plans.find((plan) => plan.id === requestedPlanId) ?? plans[0];
  const weeksQuery = useListWeeks({ planId: activePlan?.id }, Boolean(activePlan));
  const goal = goalsQuery.data?.data.find((item) => item.title === activePlan?.goal);
  const weeks = (weeksQuery.data?.data ?? []).filter((week) => week.planId === activePlan?.id);
  const sortedWeeks = [...weeks].sort((first, second) => Number(second.week.slice(5)) - Number(first.week.slice(5)));
  const tasks = allTasks.filter((task) => task.plan === activePlan?.name);
  const [tab, setTab] = useState('Overview');
  const [expandedWeek, setExpandedWeek] = useState(-1);
  const [addWeekOpen, setAddWeekOpen] = useState(false);
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [deletePlanOpen, setDeletePlanOpen] = useState(false);
  const [taskWeek, setTaskWeek] = useState<string | null>(null);
  const [weekAction, setWeekAction] = useState<{ type: 'edit' | 'delete' | 'duplicate'; week: Week } | null>(null);

  const renderTasks = (week: string, preview = false) => (
    <Box className={styles.taskList}>
      {tasks
        .filter((task) => (task.week ?? '') === week && (!preview || taskStatus(task) !== 'Completed'))
        .slice(0, preview ? 3 : undefined)
        .map((task) => (
          <Box key={task.id} className={styles.taskRow}>
            <Text
              size="13px"
              td={taskStatus(task) === 'Completed' ? 'line-through' : undefined}
              c={taskStatus(task) === 'Completed' ? 'dimmed' : undefined}
            >
              {task.title}
            </Text>
            <Box className={styles.taskProgress}>
              <TaskProgress task={task} />
            </Box>
            <Box className={styles.taskStatus}>
              <TaskStatusBadge task={task} />
            </Box>
            <Box className={styles.taskActions}>
              <TaskActions task={task} />
            </Box>
          </Box>
        ))}
    </Box>
  );

  const weekProgress = (week: string) => {
    const items = tasks.filter((task) => task.week === week);
    return items.length
      ? Math.round((items.filter((task) => taskStatus(task) === 'Completed').length / items.length) * 100)
      : 0;
  };

  const renderWeekActions = (week: Week) => (
    <Box onClick={(event) => event.stopPropagation()}>
      <Menu position="bottom-end" shadow="md" withinPortal>
        <Menu.Target>
          <Button variant="subtle" size="compact-sm" aria-label={`More options for ${week.week}`}>
            <IconDotsVertical size={16} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => setWeekAction({ type: 'edit', week })}>Edit Week</Menu.Item>
          <Menu.Item onClick={() => setWeekAction({ type: 'duplicate', week })}>Duplicate Week</Menu.Item>
          <Menu.Item color="red" onClick={() => setWeekAction({ type: 'delete', week })}>
            Delete Week
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );

  const isLoading = plansQuery.isLoading || weeksQuery.isLoading || goalsQuery.isLoading;
  const hasError = plansQuery.isError || weeksQuery.isError || goalsQuery.isError;

  return (
    <CmsPageLayout
      active="Plans"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Goals', href: goal ? `/goals/detail?id=${encodeURIComponent(goal.id)}` : '/goals' },
        ...(goal ? [{ label: goal.title, href: `/goals/detail?id=${encodeURIComponent(goal.id)}` }] : []),
        { label: 'Plans', href: '/plans' },
        ...(activePlan ? [{ label: activePlan.name }] : []),
        ...(tab === 'Tasks' ? [{ label: 'Tasks' }] : []),
      ]}
    >
      {hasError && (
        <Alert color="red" mb="md">
          Unable to load plan details. Refresh the page and try again.
        </Alert>
      )}
      {isLoading && (
        <Text c="dimmed" mb="md">
          Loading plan details…
        </Text>
      )}
      {!isLoading && !activePlan && (
        <Paper className={styles.card} p="lg">
          <Title order={2}>No plans yet</Title>
          <Text c="dimmed" mt="sm">
            Create a plan from one of your active goals.
          </Text>
          <Button component={Link} href="/plans" mt="md">
            View plans
          </Button>
        </Paper>
      )}
      {activePlan && (
        <>
          <Paper className={styles.header}>
            <Group justify="space-between" align="center" className={styles.headerTop}>
              <Group className={styles.titleGroup}>
                <Box className={styles.icon}>
                  <IconBriefcase size={24} />
                </Box>
                <Box className={styles.titleInfo}>
                  <Title order={2}>{activePlan.name}</Title>
                  <Text className={styles.timeline}>
                    <IconCalendarEvent size={15} />
                    <span>
                      Timeline <strong>{activePlan.timeline}</strong>
                    </span>
                  </Text>
                </Box>
              </Group>
              <Group>
                <Button variant="default" onClick={() => setEditPlanOpen(true)}>
                  Edit Plan
                </Button>
                <Button variant="subtle" color="red" onClick={() => setDeletePlanOpen(true)}>
                  Delete Plan
                </Button>
              </Group>
            </Group>
            <Group className={styles.progressRow} wrap="nowrap">
              <Progress value={activePlan.progress} color="teal" />
              <b>{activePlan.progress}%</b>
            </Group>
            {activePlan.focus && (
              <Text c="dimmed" mb="md">
                Focus: {activePlan.focus}
              </Text>
            )}
            <Group className={styles.tabs}>
              {['Overview', 'Weekly Plans', 'Tasks'].map((name) => (
                <Button
                  key={name}
                  variant="subtle"
                  className={tab === name ? styles.activeTab : ''}
                  onClick={() => setTab(name)}
                >
                  {name}
                </Button>
              ))}
            </Group>
          </Paper>

          {tab === 'Overview' && (
            <PlanOverview
              tasks={tasks}
              weeks={weeks}
              renderTasks={renderTasks}
              onViewWeeks={() => setTab('Weekly Plans')}
              renderWeekActions={renderWeekActions}
            />
          )}
          {tab === 'Weekly Plans' && (
            <>
              <Group justify="space-between" mt="lg" mb="md">
                <Box>
                  <Title order={3}>Weekly plans</Title>
                  <Text c="dimmed" size="sm">
                    Schedule work into weeks for this plan.
                  </Text>
                </Box>
                {sortedWeeks.length > 0 && <Button onClick={() => setAddWeekOpen(true)}>Add Week</Button>}
              </Group>
              {!isLoading && !hasError && !sortedWeeks.length && (
                <Paper className={styles.emptyWeeks}>
                  <Box className={styles.emptyWeeksIcon}>
                    <IconCalendarEvent size={28} stroke={1.5} aria-hidden="true" />
                  </Box>
                  <Title order={4}>Plan your first week</Title>
                  <Text>Set a date range, then add tasks to turn this plan into weekly progress.</Text>
                  <Button onClick={() => setAddWeekOpen(true)}>Add First Week</Button>
                </Paper>
              )}
              <Box className={styles.weeks}>
                {sortedWeeks.map((week, index) => {
                  const completed = tasks.filter(
                    (task) => task.week === week.week && taskStatus(task) === 'Completed'
                  ).length;
                  const total = tasks.filter((task) => task.week === week.week).length;
                  const today = new Date().toISOString().slice(0, 10);
                  const isCurrent = week.start <= today && week.end >= today;
                  const isExpanded = expandedWeek === index;
                  const progress = weekProgress(week.week);
                  return (
                    <Paper key={week.id} className={styles.week}>
                      <Box className={styles.weekHeader}>
                        <UnstyledButton
                          className={styles.weekToggle}
                          aria-expanded={isExpanded}
                          aria-controls={`week-tasks-${week.id}`}
                          onClick={() => setExpandedWeek(isExpanded ? -1 : index)}
                        >
                          <Box className={styles.weekInfo}>
                            <Group gap="sm">
                              <Text fw={600}>{week.week}</Text>
                              {isCurrent && (
                                <Badge variant="light" size="sm">
                                  Current
                                </Badge>
                              )}
                            </Group>
                            <Text className={styles.weekDates}>
                              <IconCalendarEvent size={15} aria-hidden="true" />
                              {weekDateRange(week)}
                            </Text>
                          </Box>
                          <Box className={styles.weekProgress}>
                            <Group justify="space-between" mb={7} gap="sm">
                              <Text size="xs" c="dimmed">
                                {completed}/{total} tasks completed
                              </Text>
                              <Text size="sm" fw={600}>
                                {progress}%
                              </Text>
                            </Group>
                            <Progress value={progress} color="teal" size="sm" />
                          </Box>
                          <IconChevronDown
                            size={18}
                            className={styles.weekChevron}
                            style={{ transform: isExpanded ? 'rotate(180deg)' : undefined }}
                            aria-hidden="true"
                          />
                        </UnstyledButton>
                        {renderWeekActions(week)}
                      </Box>
                      {isExpanded && (
                        <Box id={`week-tasks-${week.id}`} className={styles.focus}>
                          <Group justify="space-between" mb="sm">
                            <Text fw={600} size="sm">
                              Tasks: {completed}/{total} completed
                            </Text>
                            <Button size="xs" variant="light" onClick={() => setTaskWeek(week.week)}>
                              Add Task
                            </Button>
                          </Group>
                          {total ? (
                            renderTasks(week.week)
                          ) : (
                            <Text size="sm" c="dimmed">
                              No tasks for this week yet.
                            </Text>
                          )}
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </>
          )}
          {tab === 'Tasks' && (
            <Paper className={styles.card} mt="lg">
              <Group justify="space-between" mb="md">
                <Box>
                  <Title order={3}>Tasks</Title>
                  <Text size="sm" c="dimmed">
                    Tasks assigned to {activePlan.name}.
                  </Text>
                </Box>
                <Button onClick={() => setTaskWeek('')}>Add Task</Button>
              </Group>
              {!tasks.length && <Text c="dimmed">No tasks assigned to this plan yet.</Text>}
              {tasks.some((task) => !task.week) && (
                <Box mb="lg">
                  <Text fw={600} mb="sm">
                    Unassigned tasks
                  </Text>
                  {renderTasks('')}
                </Box>
              )}
              {sortedWeeks.map((week) => (
                <Box key={week.id} mb="lg">
                  <Group justify="space-between" mb="sm">
                    <Text fw={600}>{week.week}</Text>
                    <Text size="sm" c="dimmed">
                      {weekDateRange(week)}
                    </Text>
                  </Group>
                  {renderTasks(week.week)}
                </Box>
              ))}
            </Paper>
          )}
        </>
      )}

      {editPlanOpen && activePlan && (
        <PlanDialog mode="edit-plan" plan={activePlan} onClose={() => setEditPlanOpen(false)} />
      )}
      {deletePlanOpen && activePlan && (
        <CmsDialog
          title="Delete Plan"
          description={`Delete ${activePlan.name}?`}
          actionLabel="Delete Plan"
          onClose={() => setDeletePlanOpen(false)}
          onSubmit={() => deletePlan.mutate(activePlan.id, { onSuccess: () => router.replace('/plans') })}
        >
          <Text size="sm">This removes its generated milestone and leaves its tasks unassigned.</Text>
          {deletePlan.isError && (
            <Alert color="red" mt="md">
              Unable to delete this plan.
            </Alert>
          )}
        </CmsDialog>
      )}
      {taskWeek !== null && activePlan && (
        <TaskCreateDialog linkedPlan={activePlan.name} week={taskWeek || undefined} onClose={() => setTaskWeek(null)} />
      )}
      {addWeekOpen && activePlan && <WeekDialog planId={activePlan.id} onClose={() => setAddWeekOpen(false)} />}
      {weekAction?.type === 'edit' && (
        <WeekDialog planId={weekAction.week.planId} week={weekAction.week} onClose={() => setWeekAction(null)} />
      )}
      {weekAction?.type === 'duplicate' && (
        <WeekDialog
          planId={weekAction.week.planId}
          week={weekAction.week}
          duplicate
          onClose={() => setWeekAction(null)}
        />
      )}
      {weekAction?.type === 'delete' && (
        <CmsDialog
          title="Delete Week"
          description={`Delete ${weekAction.week.week}?`}
          actionLabel="Delete Week"
          onClose={() => setWeekAction(null)}
          onSubmit={() =>
            deleteWeek.mutate(weekAction.week.id, {
              onSuccess: () => {
                setExpandedWeek(-1);
                setWeekAction(null);
              },
            })
          }
        >
          <Text size="sm">Tasks in this week will remain in the plan without a week assignment.</Text>
          {deleteWeek.isError && (
            <Alert color="red" mt="md">
              Unable to delete this week.
            </Alert>
          )}
        </CmsDialog>
      )}
    </CmsPageLayout>
  );
}
