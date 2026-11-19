'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Box, Button, Group, Menu, Pagination, Select, Progress, Text, TextInput, Title } from '@mantine/core';
import { IconDotsVertical, IconSearch } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import type { Plan as PlanItem, PlanStatus } from '@core/Plan/domain/plan.interface';
import { PlanDialog } from '../components/PlanDialog';
import { CmsDialog } from '@components/CmsDialog';
import { useDeletePlan, useListPlans } from '@core/Plan/infrastructure/plan.hook';
import { useListGoals } from '@core/Goal/infrastructure/goal.hook';
import styles from './Plans.module.css';

const statusFilters = ['All Plans', 'In Progress', 'Completed', 'On Hold'] as const;

export function PlansTemplate() {
  const router = useRouter();
  const plansQuery = useListPlans();
  const goalsQuery = useListGoals({ archived: false });
  const deletePlan = useDeletePlan();
  const plans = useMemo(() => plansQuery.data?.data ?? [], [plansQuery.data?.data]);
  const goalNames = goalsQuery.data?.data.map((item) => item.title) ?? [];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<PlanItem | null>(null);
  const [status, setStatus] = useState<(typeof statusFilters)[number]>('All Plans');
  const [search, setSearch] = useState('');
  const [goal, setGoal] = useState('All Goals');
  const [sortByProgress, setSortByProgress] = useState(false);
  const visiblePlans = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = plans.filter((plan) => {
      const matchesStatus = status === 'All Plans' || plan.status === (status as PlanStatus);
      const matchesGoal = goal === 'All Goals' || plan.goal === goal;
      const matchesSearch = !query || `${plan.name} ${plan.goal}`.toLowerCase().includes(query);
      return matchesStatus && matchesGoal && matchesSearch;
    });
    return sortByProgress ? [...filtered].sort((first, second) => second.progress - first.progress) : filtered;
  }, [goal, plans, search, sortByProgress, status]);

  const rowsPerPage = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(visiblePlans.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPlans = visiblePlans.slice(startIndex, startIndex + rowsPerPage);

  return (
    <CmsPageLayout active="Plans">
      <Group justify="space-between" align="center" className={styles.heading}>
        <Box>
          <Title order={1}>Plans</Title>
          <Text c="dimmed">
            All plans from all goals, organized in one place. Track progress, see what’s next, and stay on top of your
            execution.
          </Text>
        </Box>
        <Box className={styles.toolbar}>
          <TextInput
            className={styles.search}
            size="sm"
            radius="md"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search plans..."
            aria-label="Search plans"
          />
          <Button radius="md" onClick={() => setDialogOpen(true)}>
            Add Plan
          </Button>
        </Box>
      </Group>

      <Group justify="space-between" mt="lg" className={styles.filters}>
        <Group>
          {statusFilters.map((filter, index) => (
            <Button
              key={filter}
              variant={status === filter ? 'light' : 'subtle'}
              onClick={() => {
                setStatus(filter);
                setPage(1);
              }}
            >
              {filter} ({index === 0 ? plans.length : plans.filter((plan) => plan.status === filter).length})
            </Button>
          ))}
        </Group>
        <Group>
          <Select
            className={styles.goalFilter}
            value={goal}
            onChange={(value) => {
              setGoal(value ?? 'All Goals');
              setPage(1);
            }}
            data={['All Goals', ...goalNames]}
            aria-label="Filter by goal"
            searchable
            nothingFoundMessage="No goals found"
            allowDeselect={false}
            radius="md"
            size="sm"
            comboboxProps={{ shadow: 'md' }}
          />
          <Select
            className={styles.sortFilter}
            value={sortByProgress ? 'progress' : 'updated'}
            onChange={(value) => {
              setSortByProgress(value === 'progress');
              setPage(1);
            }}
            data={[
              { value: 'updated', label: 'Sort by Updated' },
              { value: 'progress', label: 'Sort by Progress' },
            ]}
            aria-label="Sort plans"
            allowDeselect={false}
            radius="md"
            size="sm"
            comboboxProps={{ shadow: 'md' }}
          />
        </Group>
      </Group>

      {plansQuery.isError && (
        <Text c="red" mb="md">
          Unable to load plans. Refresh and try again.
        </Text>
      )}
      {deletePlan.isError && (
        <Text c="red" mb="md">
          Unable to delete the selected plan.
        </Text>
      )}
      {plansQuery.isLoading && (
        <Text c="dimmed" mb="md">
          Loading plans…
        </Text>
      )}
      <Box className={styles.tableWrap}>
        <Box className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                {['PLAN NAME', 'GOAL', 'TIMELINE', 'PROGRESS', 'WEEKLY PLANS', 'TASKS', 'STATUS', ''].map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.map((plan) => {
                return (
                  <tr
                    key={plan.id}
                    onClick={(event) => {
                      if (
                        event.target instanceof Element &&
                        event.target.closest('button, a, input, select, [role="menu"]')
                      ) {
                        return;
                      }
                      router.push(`/plans/detail?id=${encodeURIComponent(plan.id)}`);
                    }}
                  >
                    <td data-label="Plan name">{plan.name}</td>
                    <td data-label="Goal">{plan.goal}</td>
                    <td data-label="Timeline">{plan.timeline}</td>
                    <td data-label="Progress">
                      <b>{plan.progress}%</b>
                      <Progress value={plan.progress} size="sm" color="teal" />
                    </td>
                    <td data-label="Weekly plans">{plan.weeks}</td>
                    <td data-label="Tasks">{plan.tasks}</td>
                    <td data-label="Status">
                      <Badge
                        className={styles.statusBadge}
                        color={
                          plan.status === 'Completed'
                            ? 'green'
                            : plan.status === 'On Hold'
                              ? 'orange'
                              : plan.status === 'Not Started'
                                ? 'gray'
                                : 'blue'
                        }
                      >
                        {plan.status}
                      </Badge>
                    </td>
                    <td className={styles.rowActions} data-label="Actions" onClick={(event) => event.stopPropagation()}>
                      <Menu position="bottom-end" shadow="md" withinPortal>
                        <Menu.Target>
                          <Button
                            variant="subtle"
                            size="compact-sm"
                            aria-label={`Actions for ${plan.name}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <IconDotsVertical size={16} />
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
                          <Menu.Item onClick={() => setEditingPlan(plan)}>Edit Plan</Menu.Item>
                          <Menu.Item color="red" onClick={() => setDeletingPlan(plan)}>
                            Delete Plan
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
        <Group justify="space-between" p="md" gap="md" className={styles.paginationFooter}>
          <Group gap="sm">
            <Text size="sm" c="dimmed">
              Showing {visiblePlans.length ? startIndex + 1 : 0}–
              {Math.min(startIndex + rowsPerPage, visiblePlans.length)} of {visiblePlans.length} plans
            </Text>
            <Select
              aria-label="Plans per page"
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
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setPage}
            disabled={!visiblePlans.length}
            size="sm"
          />
        </Group>
      </Box>

      {dialogOpen && <PlanDialog mode="add-plan" onClose={() => setDialogOpen(false)} />}
      {editingPlan && <PlanDialog mode="edit-plan" plan={editingPlan} onClose={() => setEditingPlan(null)} />}
      {deletingPlan && (
        <CmsDialog
          title="Delete Plan"
          description={`Delete ${deletingPlan.name}?`}
          actionLabel="Delete Plan"
          onClose={() => setDeletingPlan(null)}
          onSubmit={() => {
            deletePlan.mutate(deletingPlan.id, { onSuccess: () => setDeletingPlan(null) });
          }}
        >
          <Text size="sm">This plan will be removed, and its tasks will remain without a plan assignment.</Text>
        </CmsDialog>
      )}
    </CmsPageLayout>
  );
}
