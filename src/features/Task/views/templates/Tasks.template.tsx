'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Pagination,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { TaskCreateDialog } from '../components/TaskCreateDialog';
import styles from './Tasks.module.css';

import { taskStatus, taskStatuses } from '../data/tasks';
import { useTasks } from '../data/taskStore';
import { TaskProgress, TaskStatusBadge } from '../components/TaskProgress';
import { TaskActions } from '../components/TaskActions';
import { useListPlans } from '@core/Plan/infrastructure/plan.hook';
import { useListGoals } from '@core/Goal/infrastructure/goal.hook';

export function TasksTemplate() {
  const [tasks, , tasksQuery] = useTasks();
  const plansQuery = useListPlans();
  const goalsQuery = useListGoals();
  const plans = plansQuery.data?.data ?? [];
  const goals = goalsQuery.data?.data ?? [];
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Tasks');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [opened, setOpened] = useState(false);
  const visible = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) && (filter === 'All Tasks' || taskStatus(task) === filter)
  );
  const rowsPerPage = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(visible.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTasks = visible.slice(startIndex, startIndex + rowsPerPage);

  return (
    <CmsPageLayout active="Tasks">
      <Group justify="space-between" className={styles.heading}>
        <Box>
          <Title order={1}>Tasks</Title>
          <Text c="dimmed">Turn your plans into small, meaningful actions.</Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Add Task
        </Button>
      </Group>
      <Box className={styles.stats}>
        {[
          ['Total tasks', tasks.length],
          ...taskStatuses.map((status) => [status, tasks.filter((task) => taskStatus(task) === status).length]),
        ].map(([label, value]) => (
          <Paper className={styles.stat} key={label}>
            <Text c="dimmed">{label}</Text>
            <Title order={2}>{value}</Title>
          </Paper>
        ))}
      </Box>
      {(tasksQuery.isError || plansQuery.isError || goalsQuery.isError) && (
        <Text c="red" mb="md">
          Unable to load task data. Refresh the page and try again.
        </Text>
      )}
      {(tasksQuery.isLoading || plansQuery.isLoading || goalsQuery.isLoading) && (
        <Text c="dimmed" mb="md">
          Loading tasks…
        </Text>
      )}
      <Group justify="space-between" className={styles.toolbar}>
        <Group className={styles.statusFilters}>
          {['All Tasks', ...taskStatuses].map((item) => (
            <Button
              key={item}
              variant={filter === item ? 'light' : 'subtle'}
              onClick={() => {
                setFilter(item);
                setPage(1);
              }}
            >
              {item}
            </Button>
          ))}
        </Group>
        <TextInput
          aria-label="Search tasks"
          placeholder="Search tasks..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
        />
      </Group>
      <Paper className={styles.tableContainer}>
        <Table.ScrollContainer type="native" minWidth={900}>
          <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover aria-label="Tasks">
            <Table.Thead>
              <Table.Tr>
                {['Task', 'Plan', 'Goal', 'Due Date', 'Priority', 'Progress', 'Status', 'Actions'].map((column) => (
                  <Table.Th key={column} className={column === 'Actions' ? styles.actions : undefined}>
                    {column}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedTasks.map((task) => (
                <Table.Tr key={task.id}>
                  <Table.Td>
                    <Text fw={600} size="sm">
                      {task.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {plans.find((item) => item.name === task.plan) ? (
                      <Anchor
                        component={Link}
                        href={`/plans/detail?id=${encodeURIComponent(plans.find((item) => item.name === task.plan)!.id)}`}
                        size="sm"
                      >
                        {task.plan}
                      </Anchor>
                    ) : (
                      <Text size="sm" c="dimmed">
                        No linked plan
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {goals.find((item) => item.title === plans.find((plan) => plan.name === task.plan)?.goal) ? (
                      <Anchor
                        component={Link}
                        href={`/goals/detail?id=${encodeURIComponent(goals.find((item) => item.title === plans.find((plan) => plan.name === task.plan)?.goal)!.id)}`}
                        size="sm"
                      >
                        {plans.find((item) => item.name === task.plan)?.goal}
                      </Anchor>
                    ) : (
                      <Text size="sm" c="dimmed">
                        No linked goal
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                      {(task.effectiveDue ?? task.due)
                        ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
                            new Date(`${task.effectiveDue ?? task.due}T00:00:00`)
                          )
                        : 'No due date'}
                    </Text>
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
                  <Table.Td className={styles.actions}>
                    <TaskActions task={task} />
                  </Table.Td>
                </Table.Tr>
              ))}
              {!visible.length && (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Box className={styles.empty}>
                      <Title order={3}>No tasks found</Title>
                      <Text c="dimmed">Add a task or try a different search or filter.</Text>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        <Group justify="space-between" p="md" style={{ borderTop: '1px solid #e5eaf1' }}>
          <Group gap="sm">
            <Text size="sm" c="dimmed">
              Showing {visible.length ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, visible.length)} of{' '}
              {visible.length} tasks
            </Text>
            <Select
              aria-label="Tasks per page"
              value={pageSize}
              data={['5', '10', '20', '50']}
              onChange={(value) => {
                setPageSize(value || '10');
                setPage(1);
              }}
              w={80}
              allowDeselect={false}
            />
            <Text size="sm" c="dimmed">
              per page
            </Text>
          </Group>
          <Pagination total={totalPages} value={currentPage} onChange={setPage} disabled={!visible.length} size="sm" />
        </Group>
      </Paper>
      {opened && <TaskCreateDialog onClose={() => setOpened(false)} />}
    </CmsPageLayout>
  );
}
