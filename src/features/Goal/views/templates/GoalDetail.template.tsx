'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Anchor, Badge, Box, Button, Group, Menu, Paper, Progress, Table, Text, Title } from '@mantine/core';
import type { PlanItem } from '@features/Plan/views/data/plans';
import { usePlans } from '@features/Plan/views/data/planStore';
import { PlanDialog } from '@features/Plan/views/components/PlanDialog';
import { CmsDialog } from '@components/CmsDialog';
import { useTasks } from '@features/Task/views/data/taskStore';
import { TaskProgress, TaskStatusBadge } from '@features/Task/views/components/TaskProgress';
import { TaskActions } from '@features/Task/views/components/TaskActions';
import { IconBuildingBank, IconCalendarEvent, IconDotsVertical } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { GoalDialog } from '../components/GoalDialog';
import { useGoalMilestones, type GoalMilestone } from '../data/goalMilestoneStore';
import styles from './GoalDetail.module.css';
import { GoalOverview } from '../components/GoalOverview';

export function GoalDetailTemplate() {
  const [tab, setTab] = useState('Overview');
  const [dialog, setDialog] = useState<'edit-goal' | 'add-plan' | ''>('');
  const [milestones, setMilestones] = useGoalMilestones();
  const [editingMilestone, setEditingMilestone] = useState<GoalMilestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<GoalMilestone | null>(null);
  const [plans, setPlanItems] = usePlans();
  const [tasks, setTasks] = useTasks();
  const relatedPlans = plans.filter((plan) => plan.goal === 'Build Passive Income');
  const relatedTasks = tasks.filter((task) => relatedPlans.some((plan) => plan.name === task.plan));

  return (
    <CmsPageLayout active="Goals" goalCount={7}>
      <Paper className={styles.header}>
        <Group justify="space-between" align="center" className={styles.headerTop}>
          <Group className={styles.titleGroup}>
            <Box className={styles.icon}>
              <IconBuildingBank size={26} />
            </Box>
            <Box className={styles.titleInfo}>
              <Title order={2}>Build Passive Income</Title>
              <Text className={styles.targetDate}>
                <IconCalendarEvent size={15} />
                <span>
                  Target date <strong>Dec 2030</strong>
                </span>
              </Text>
            </Box>
          </Group>
          <Button variant="default" onClick={() => setDialog('edit-goal')}>
            Edit Goal
          </Button>
        </Group>
        <Group className={styles.progressRow} wrap="nowrap">
          <Progress value={68} color="teal" />
          <b>68%</b>
        </Group>
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
        <Group className={styles.summary} align="stretch">
          <Paper className={styles.card}>
            <Text className={styles.label}>GOAL DESCRIPTION</Text>
            <Text mt="md">
              Build multiple income streams from investment, business, and digital products so I can achieve financial
              freedom.
            </Text>
          </Paper>
          <Paper className={styles.card}>
            <Text className={styles.label}>TARGET</Text>
            <Group mt="md" wrap="nowrap">
              <Box className={styles.targetIcon}>
                <IconCalendarEvent size={22} />
              </Box>
              <Box>
                <Title order={3}>Dec 2030</Title>
                <Text c="dimmed">Remaining 4 years 3 months</Text>
              </Box>
            </Group>
          </Paper>
        </Group>
      )}

      {tab === 'Overview' ? (
        <GoalOverview
          milestones={milestones}
          onViewPlans={() => setTab('Plans')}
          onEditPlan={setEditingMilestone}
          onDeletePlan={setDeletingMilestone}
        />
      ) : tab === 'Plans' ? (
        <>
          <Group justify="space-between" mt="lg">
            <Title order={3}>Plans (Milestones)</Title>
            <Button onClick={() => setDialog('add-plan')}>Add Plan</Button>
          </Group>
          <Box className={styles.milestones}>
            {milestones.map((milestone, index) => (
              <Paper className={styles.milestone} key={milestone.title}>
                <Box className={styles.index}>{index}</Box>
                <Box className={styles.milestoneInfo}>
                  <Anchor component={Link} href="/plans/detail" fw={600}>
                    {milestone.title}
                  </Anchor>
                  <Box className={styles.milestoneDates}>
                    <Text>
                      <span>Start date</span> {milestone.startDate}
                    </Text>
                    <Text>
                      <span>End date</span> {milestone.endDate}
                    </Text>
                  </Box>
                </Box>
                <Text>{milestone.progress}%</Text>
                <Progress value={milestone.progress} color="teal" />
                <Menu position="bottom-end" shadow="md" withinPortal>
                  <Menu.Target>
                    <Button
                      className={styles.milestoneActions}
                      variant="subtle"
                      aria-label={`More options for ${milestone.title}`}
                    >
                      <IconDotsVertical size={16} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
                    <Menu.Item onClick={() => setEditingMilestone(milestone)}>Edit Plan</Menu.Item>
                    <Menu.Item color="red" onClick={() => setDeletingMilestone(milestone)}>
                      Delete Plan
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Paper>
            ))}
          </Box>
        </>
      ) : (
        <Paper className={styles.card} mt="lg">
          <Group justify="space-between" mb="md">
            <Box>
              <Title order={3}>Related Tasks</Title>
              <Text size="sm" c="dimmed">
                Tasks from plans connected to this goal.
              </Text>
            </Box>
            <Badge variant="light">{relatedTasks.length} tasks</Badge>
          </Group>
          {relatedTasks.length ? (
            <Table.ScrollContainer type="native" minWidth={760}>
              <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    {['Task', 'Plan', 'Due Date', 'Priority', 'Progress', 'Status', 'Actions'].map((label) => (
                      <Table.Th key={label} className={label === 'Actions' ? styles.taskActions : undefined}>
                        {label}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {relatedTasks.map((task) => (
                    <Table.Tr key={task.id}>
                      <Table.Td>
                        <Text size="sm" fw={600}>
                          {task.title}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Anchor component={Link} href="/plans/detail" size="sm">
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
                      <Table.Td className={styles.taskActions}>
                        <TaskActions task={task} />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : (
            <Text c="dimmed" py="lg">
              No tasks linked to this goal yet. Tasks will appear here when added to its plans.
            </Text>
          )}
        </Paper>
      )}

      {dialog && (
        <GoalDialog
          mode={dialog}
          onClose={() => setDialog('')}
          onSavePlan={(created) => {
            setPlanItems((items) => [...items, created]);
            setMilestones((items) => [
              ...items,
              {
                title: created.name,
                timeline: created.timeline,
                progress: created.progress,
              },
            ]);
          }}
        />
      )}
      {editingMilestone && (
        <PlanDialog
          mode="edit-plan"
          plan={
            plans.find((plan) => plan.name === editingMilestone.title) ??
            ({
              name: editingMilestone.title,
              goal: 'Build Passive Income',
              timeline:
                editingMilestone.startDate && editingMilestone.endDate
                  ? `${editingMilestone.startDate} – ${editingMilestone.endDate}`
                  : editingMilestone.timeline,
              progress: editingMilestone.progress,
              weeks: 0,
              tasks: 0,
              focus: '',
              status: 'In Progress',
            } satisfies PlanItem)
          }
          onClose={() => setEditingMilestone(null)}
          onSave={(updated) => {
            const [startDate, endDate] = updated.timeline.split('–').map((date) => date.trim());
            setMilestones((items) =>
              items.map((item) =>
                item.title === editingMilestone.title
                  ? { ...item, title: updated.name, timeline: updated.timeline, startDate, endDate }
                  : item
              )
            );
            setPlanItems((items) =>
              items.map((item) => (item.name === editingMilestone.title ? { ...item, ...updated } : item))
            );
            setTasks((items) =>
              items.map((task) => (task.plan === editingMilestone.title ? { ...task, plan: updated.name } : task))
            );
          }}
        />
      )}
      {deletingMilestone && (
        <CmsDialog
          title="Delete Plan"
          description={`Delete ${deletingMilestone.title}?`}
          actionLabel="Delete Plan"
          onClose={() => setDeletingMilestone(null)}
          onSubmit={() => {
            setMilestones((items) => items.filter((item) => item.title !== deletingMilestone.title));
            setPlanItems((items) => items.filter((item) => item.name !== deletingMilestone.title));
            setTasks((items) =>
              items.map((task) => (task.plan === deletingMilestone.title ? { ...task, plan: '' } : task))
            );
            setDeletingMilestone(null);
          }}
        >
          <Text size="sm">This plan will be removed, and its tasks will remain without a plan assignment.</Text>
        </CmsDialog>
      )}
    </CmsPageLayout>
  );
}
