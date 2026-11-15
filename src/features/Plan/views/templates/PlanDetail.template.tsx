'use client';

import { useState } from 'react';
import { Box, Button, Group, Menu, Paper, Progress, Text, Title } from '@mantine/core';
import { TaskCreateDialog } from '@features/Task/views/components/TaskCreateDialog';
import { IconBriefcase, IconCalendarEvent, IconChevronRight, IconDotsVertical } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { PlanDialog } from '../components/PlanDialog';
import { useWeeks, weekDateRange, type WeekPlan } from '../data/weekStore';
import { WeekDialog } from '../components/WeekDialog';
import { CmsDialog } from '@components/CmsDialog';
import styles from './PlanDetail.module.css';
import { useTasks } from '@features/Task/views/data/taskStore';
import { taskStatus } from '@features/Task/views/data/tasks';
import { TaskProgress, TaskStatusBadge } from '@features/Task/views/components/TaskProgress';
import { PlanOverview } from '../components/PlanOverview';

export function PlanDetailTemplate() {
  const [weeks, setWeeks] = useWeeks();
  const sortedWeeks = [...weeks].sort((a, b) => Number(b.week.slice(5)) - Number(a.week.slice(5)));
  const [weekAction, setWeekAction] = useState<{ type: 'edit' | 'delete'; week: WeekPlan } | null>(null);
  const [allTasks, setTasks] = useTasks();
  const tasks = allTasks.filter((task) => task.plan === 'Build E-Commerce Business');
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
  const [tab, setTab] = useState('Overview');
  const [expandedWeek, setExpandedWeek] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [taskWeek, setTaskWeek] = useState<string | null>(null);

  const renderWeekActions = (item: WeekPlan) => (
    <Box onClick={(event) => event.stopPropagation()}>
      <Menu position="bottom-end" shadow="md" withinPortal>
        <Menu.Target>
          <Button variant="subtle" size="compact-sm" aria-label={`More options for ${item.week}`}>
            <IconDotsVertical size={16} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => setTaskWeek(item.week)}>Add Task</Menu.Item>
          <Menu.Item
            onClick={() => {
              setTab('Weekly Plans');
              setExpandedWeek(sortedWeeks.findIndex((entry) => entry.id === item.id));
            }}
          >
            View Tasks
          </Menu.Item>
          <Menu.Item onClick={() => setWeekAction({ type: 'edit', week: item })}>Edit Week</Menu.Item>
          <Menu.Item color="red" onClick={() => setWeekAction({ type: 'delete', week: item })}>
            Delete Week
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );

  return (
    <CmsPageLayout
      active="Plans"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Goals', href: '/goals' },
        { label: 'Build Passive Income', href: '/goals/detail' },
        { label: 'Plans', href: '/plans' },
        { label: 'Build E-Commerce Business' },
        ...(tab === 'Tasks' ? [{ label: 'Tasks' }] : []),
      ]}
    >
      <Paper className={styles.header}>
        <Group justify="space-between" align="center" className={styles.headerTop}>
          <Group className={styles.titleGroup}>
            <Box className={styles.icon}>
              <IconBriefcase size={24} />
            </Box>
            <Box className={styles.titleInfo}>
              <Title order={2}>Build E-Commerce Business</Title>
              <Text className={styles.timeline}>
                <IconCalendarEvent size={15} />
                <span>
                  Timeline <strong>Jan 2026 – Dec 2027</strong>
                </span>
              </Text>
            </Box>
          </Group>
          <Button variant="default" onClick={() => setEditOpen(true)}>
            Edit Plan
          </Button>
        </Group>
        <Group className={styles.progressRow} wrap="nowrap">
          <Progress value={62} color="teal" />
          <b>62%</b>
        </Group>
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
        <Group className={styles.summary} align="stretch">
          <Paper className={styles.card}>
            <Text className={styles.label}>PLAN DESCRIPTION</Text>
            <Text mt="md" size="13px" lh={1.6}>
              Create and grow an e-commerce business from scratch, including product, marketing, and customer
              management.
            </Text>
          </Paper>
          <Paper className={styles.card}>
            <Group wrap="nowrap">
              <Box className={styles.targetIcon}>
                <IconCalendarEvent size={22} />
              </Box>
              <Box>
                <Text className={styles.label}>TARGET</Text>
                <Title order={3} size={20}>
                  Dec 2027
                </Title>
                <Text c="dimmed" size="13px">
                  Remaining 1 year 3 months
                </Text>
              </Box>
            </Group>
          </Paper>
        </Group>
      )}

      {tab === 'Overview' ? (
        <PlanOverview
          tasks={tasks}
          renderWeekActions={renderWeekActions}
          renderTasks={renderTasks}
          onViewWeeks={() => {
            setTab('Weekly Plans');
            setExpandedWeek(sortedWeeks.findIndex((week) => week.week === 'Week 40'));
          }}
        />
      ) : tab === 'Weekly Plans' ? (
        <>
          <Group justify="space-between" mt="lg">
            <Title order={3} size={20}>
              Weekly Plans
            </Title>
            <Button onClick={() => setDialogOpen(true)}>Add Week</Button>
          </Group>
          <Box className={styles.weeks}>
            {sortedWeeks.map((item, index) => (
              <Paper
                className={styles.week}
                key={item.id}
                onClick={() => setExpandedWeek(expandedWeek === index ? -1 : index)}
              >
                <IconChevronRight className={styles.weekChevron} size={18} />
                <Box className={styles.weekInfo}>
                  <b>
                    {item.week}
                    {item.week === 'Week 40' && (
                      <Text component="span" c="blue">
                        {' '}
                        (Current)
                      </Text>
                    )}
                  </b>
                  <Text c="dimmed" size="12px">
                    {weekDateRange(item)}
                  </Text>
                </Box>
                <Text>{weekProgress(item.week)}%</Text>
                <Progress value={weekProgress(item.week)} color="teal" />
                {renderWeekActions(item)}
                {expandedWeek === index && (
                  <Box className={styles.focus} onClick={(event) => event.stopPropagation()}>
                    <Group justify="space-between" mb="sm">
                      <Text fw={600} size="sm">
                        Tasks:{' '}
                        {tasks.filter((task) => task.week === item.week && taskStatus(task) === 'Completed').length}/
                        {tasks.filter((task) => task.week === item.week).length} completed
                      </Text>
                      <Button size="xs" variant="light" onClick={() => setTaskWeek(item.week)}>
                        Add Task
                      </Button>
                    </Group>
                    {renderTasks(item.week)}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </>
      ) : (
        <Paper className={styles.card} mt="lg">
          <Title order={3} size={20}>
            {tab}
          </Title>
          <Text c="dimmed" size="13px" mb="lg">
            All tasks for Build E-Commerce Business, grouped by week.
          </Text>
          {tasks.some((task) => !task.week) && (
            <Box mb="lg">
              <Text fw={600} mb="sm">
                Unassigned tasks
              </Text>
              {renderTasks('')}
            </Box>
          )}
          {sortedWeeks.map((week) => (
            <Box key={week.week} mb="lg">
              <Group justify="space-between" mb="sm">
                <Text fw={600}>{week.week}</Text>
                <Group gap="sm">
                  <Text size="sm" c="dimmed">
                    {weekDateRange(week)}
                  </Text>
                  {renderWeekActions(week)}
                </Group>
              </Group>
              {renderTasks(week.week)}
            </Box>
          ))}
        </Paper>
      )}

      {editOpen && <PlanDialog mode="edit-plan" onClose={() => setEditOpen(false)} />}
      {taskWeek && (
        <TaskCreateDialog
          linkedPlan="Build E-Commerce Business"
          week={taskWeek}
          onClose={() => {
            setTaskWeek(null);
          }}
        />
      )}
      {dialogOpen && <WeekDialog onClose={() => setDialogOpen(false)} />}
      {weekAction?.type === 'edit' && <WeekDialog week={weekAction.week} onClose={() => setWeekAction(null)} />}
      {weekAction?.type === 'delete' && (
        <CmsDialog
          title="Delete Week"
          description={`Delete ${weekAction.week.week}?`}
          actionLabel="Delete Week"
          onClose={() => setWeekAction(null)}
          onSubmit={() => {
            setTasks((items) =>
              items.map((task) =>
                task.plan === 'Build E-Commerce Business' && task.week === weekAction.week.week
                  ? { ...task, week: undefined }
                  : task
              )
            );
            setWeeks((items) => items.filter((item) => item.id !== weekAction.week.id));
            setExpandedWeek(-1);
            setWeekAction(null);
          }}
        >
          <Text size="sm">
            Linked tasks will be kept in this plan and on the Tasks page, without a week assignment.
          </Text>
        </CmsDialog>
      )}
    </CmsPageLayout>
  );
}
