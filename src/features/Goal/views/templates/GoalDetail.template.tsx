'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Alert, Anchor, Badge, Box, Button, Group, Menu, Paper, Progress, Table, Text, Title } from '@mantine/core';
import { IconBriefcase, IconBuildingBank, IconDotsVertical } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { CmsDialog } from '@components/CmsDialog';
import { useListGoals, useListMilestones, useDeleteMilestone } from '@core/Goal/infrastructure/goal.hook';
import { useListPlans, useDeletePlan } from '@core/Plan/infrastructure/plan.hook';
import { useTasks } from '@features/Task/views/data/taskStore';
import { TaskProgress, TaskStatusBadge } from '@features/Task/views/components/TaskProgress';
import { TaskActions } from '@features/Task/views/components/TaskActions';
import { GoalDialog } from '../components/GoalDialog';
import { GoalOverview } from '../components/GoalOverview';
import { GoalMilestoneDialog } from '../components/GoalMilestoneDialog';
import { PlanDialog } from '@features/Plan/views/components/PlanDialog';
import type { Milestone as GoalMilestone } from '@core/Goal/domain/goal.interface';
import type { Plan as PlanItem } from '@core/Plan/domain/plan.interface';
import styles from './GoalDetail.module.css';

export function GoalDetailTemplate() {
  const searchParams = useSearchParams();
  const requestedGoalId = searchParams.get('id');
  const goalsQuery = useListGoals();
  const plansQuery = useListPlans();
  const [allTasks] = useTasks();
  const goal =
    goalsQuery.data?.data.find((item) => item.id === requestedGoalId) ??
    goalsQuery.data?.data.find((item) => !item.archived);
  const milestonesQuery = useListMilestones(goal?.id ?? '');
  const deleteMilestone = useDeleteMilestone();
  const deletePlan = useDeletePlan();
  const [tab, setTab] = useState('Overview');
  const [dialog, setDialog] = useState<'edit-goal' | 'add-plan' | ''>('');
  const [editingMilestone, setEditingMilestone] = useState<GoalMilestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<GoalMilestone | null>(null);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<PlanItem | null>(null);
  const [error, setError] = useState('');
  const plans = (plansQuery.data?.data ?? []).filter((plan) => plan.goal === goal?.title);
  const tasks = allTasks.filter((task) => plans.some((plan) => plan.name === task.plan));
  const milestones = milestonesQuery.data?.data ?? [];
  const isLoading = goalsQuery.isLoading || plansQuery.isLoading || (Boolean(goal) && milestonesQuery.isLoading);
  const hasError = goalsQuery.isError || plansQuery.isError || milestonesQuery.isError;

  const planForMilestone = (milestone: GoalMilestone): PlanItem | undefined =>
    plans.find((plan) => plan.name === milestone.title);

  return (
    <CmsPageLayout
      active="Goals"
      goalCount={goalsQuery.data?.data.filter((item) => !item.archived).length ?? 0}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Goals', href: '/goals' },
        ...(goal ? [{ label: goal.title }] : []),
      ]}
    >
      {hasError && (
        <Alert color="red" mb="md">
          Unable to load this goal and its related data. Refresh the page and try again.
        </Alert>
      )}
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      {isLoading && (
        <Text c="dimmed" mb="md">
          Loading goal…
        </Text>
      )}
      {!isLoading && !goal && (
        <Paper className={styles.card} p="lg">
          <Title order={2}>Goal not found</Title>
          <Text c="dimmed" mt="sm">
            Choose a goal from your goals list.
          </Text>
          <Button component={Link} href="/goals" mt="md">
            View goals
          </Button>
        </Paper>
      )}
      {goal && (
        <>
          <Paper className={styles.header}>
            <Group justify="space-between" align="center" className={styles.headerTop}>
              <Group className={styles.titleGroup}>
                <Box className={styles.icon}>
                  <IconBuildingBank size={26} />
                </Box>
                <Box className={styles.titleInfo}>
                  <Title order={2}>{goal.title}</Title>
                </Box>
              </Group>
              <Button variant="default" onClick={() => setDialog('edit-goal')}>
                Edit Goal
              </Button>
            </Group>
            <Group className={styles.progressRow} wrap="nowrap">
              <Progress value={goal.progress} color={goal.color} />
              <b>{goal.progress}%</b>
            </Group>
            {goal.description && (
              <Text c="dimmed" mb="md">
                {goal.description}
              </Text>
            )}
            <Group className={styles.tabs}>
              {['Overview', 'Plans', 'Tasks'].map((name) => (
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
            <GoalOverview
              milestones={milestones}
              plans={plans}
              onViewPlans={() => setTab('Plans')}
              onEditPlan={setEditingMilestone}
              onDeletePlan={(milestone) => {
                setDeletingMilestone(milestone);
                setError('');
              }}
            />
          )}
          {tab === 'Plans' && (
            <>
              <Group justify="space-between" mt="lg">
                <Title order={3}>Plans</Title>
                {plans.length > 0 && <Button onClick={() => setDialog('add-plan')}>Add Plan</Button>}
              </Group>
              {!isLoading && !hasError && !plans.length && (
                <Paper className={styles.emptyPlans}>
                  <Box className={styles.emptyPlansIcon}>
                    <IconBriefcase size={28} stroke={1.5} aria-hidden="true" />
                  </Box>
                  <Title order={4}>Give this goal a plan</Title>
                  <Text>Start with one plan, then break it into weekly tasks to move this goal forward.</Text>
                  <Button onClick={() => setDialog('add-plan')}>Add First Plan</Button>
                </Paper>
              )}
              {plans.length > 0 && (
                <Box className={styles.milestones}>
                  {plans.map((plan, index) => (
                    <Paper className={styles.milestone} key={plan.id}>
                      <Box className={styles.index}>{index + 1}</Box>
                      <Box className={styles.milestoneInfo}>
                        <Anchor component={Link} href={`/plans/detail?id=${encodeURIComponent(plan.id)}`} fw={600}>
                          {plan.name}
                        </Anchor>
                        <Text size="sm" c="dimmed">
                          {plan.timeline}
                        </Text>
                      </Box>
                      <Text>{plan.progress}%</Text>
                      <Progress value={plan.progress} color="teal" />
                      <Menu position="bottom-end" shadow="md" withinPortal>
                        <Menu.Target>
                          <Button
                            className={styles.milestoneActions}
                            variant="subtle"
                            aria-label={`More options for ${plan.name}`}
                          >
                            <IconDotsVertical size={16} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item onClick={() => setEditingPlan(plan)}>Edit Plan</Menu.Item>
                          <Menu.Item color="red" onClick={() => setDeletingPlan(plan)}>
                            Delete Plan
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Paper>
                  ))}
                </Box>
              )}
            </>
          )}
          {tab === 'Tasks' && (
            <Paper className={styles.card} mt="lg">
              <Group justify="space-between" mb="md">
                <Box>
                  <Title order={3}>Related Tasks</Title>
                  <Text size="sm" c="dimmed">
                    Tasks from plans connected to this goal.
                  </Text>
                </Box>
                <Badge variant="light">{tasks.length} tasks</Badge>
              </Group>
              {tasks.length ? (
                <Table.ScrollContainer type="native" minWidth={760}>
                  <Table verticalSpacing="md" highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        {['Task', 'Plan', 'Due Date', 'Priority', 'Progress', 'Status', 'Actions'].map((label) => (
                          <Table.Th key={label}>{label}</Table.Th>
                        ))}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {tasks.map((task) => (
                        <Table.Tr key={task.id}>
                          <Table.Td>
                            <Text size="sm" fw={600}>
                              {task.title}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Anchor
                              component={Link}
                              href={`/plans/detail?id=${encodeURIComponent(plans.find((plan) => plan.name === task.plan)?.id ?? '')}`}
                              size="sm"
                            >
                              {task.plan}
                            </Anchor>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{task.due ?? 'No due date'}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'gray'}
                            >
                              {task.priority}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <TaskProgress task={task} />
                          </Table.Td>
                          <Table.Td>
                            <TaskStatusBadge task={task} />
                          </Table.Td>
                          <Table.Td>
                            <TaskActions task={task} />
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              ) : (
                <Text c="dimmed" py="lg">
                  No tasks linked to this goal yet.
                </Text>
              )}
            </Paper>
          )}
        </>
      )}

      {dialog === 'edit-goal' && goal && <GoalDialog mode="edit-goal" goal={goal} onClose={() => setDialog('')} />}
      {dialog === 'add-plan' && goal && (
        <PlanDialog mode="add-plan" initialGoal={goal.title} onClose={() => setDialog('')} />
      )}
      {editingPlan && <PlanDialog mode="edit-plan" plan={editingPlan} onClose={() => setEditingPlan(null)} />}
      {editingMilestone && goal && planForMilestone(editingMilestone) && (
        <PlanDialog
          mode="edit-plan"
          plan={planForMilestone(editingMilestone)}
          onClose={() => setEditingMilestone(null)}
        />
      )}
      {editingMilestone && goal && !planForMilestone(editingMilestone) && (
        <GoalMilestoneDialog goalId={goal.id} milestone={editingMilestone} onClose={() => setEditingMilestone(null)} />
      )}
      {deletingMilestone && goal && (
        <CmsDialog
          title={planForMilestone(deletingMilestone) ? 'Delete Plan' : 'Delete Milestone'}
          description={`Delete ${deletingMilestone.title}?`}
          actionLabel="Delete"
          onClose={() => setDeletingMilestone(null)}
          onSubmit={() => {
            const plan = planForMilestone(deletingMilestone);
            if (plan)
              deletePlan.mutate(plan.id, {
                onSuccess: () => setDeletingMilestone(null),
                onError: () => setError('Unable to delete this plan.'),
              });
            else
              deleteMilestone.mutate(
                { goalId: goal.id, id: deletingMilestone.id },
                {
                  onSuccess: () => setDeletingMilestone(null),
                  onError: () => setError('Unable to delete this milestone.'),
                }
              );
          }}
        >
          <Text size="sm">
            {planForMilestone(deletingMilestone)
              ? 'Its generated milestone will also be removed and linked tasks will remain unassigned.'
              : 'This milestone will be permanently removed.'}
          </Text>
          {(deletePlan.isError || deleteMilestone.isError) && (
            <Alert color="red" mt="md">
              Unable to delete this item.
            </Alert>
          )}
        </CmsDialog>
      )}
      {deletingPlan && (
        <CmsDialog
          title="Delete Plan"
          description={`Delete ${deletingPlan.name}?`}
          actionLabel="Delete Plan"
          onClose={() => setDeletingPlan(null)}
          onSubmit={() =>
            deletePlan.mutate(deletingPlan.id, {
              onSuccess: () => setDeletingPlan(null),
              onError: () => setError('Unable to delete this plan.'),
            })
          }
        >
          <Text size="sm">Its generated milestone will be removed and its tasks will remain unassigned.</Text>
          {deletePlan.isError && (
            <Alert color="red" mt="md">
              Unable to delete this plan.
            </Alert>
          )}
        </CmsDialog>
      )}
    </CmsPageLayout>
  );
}
