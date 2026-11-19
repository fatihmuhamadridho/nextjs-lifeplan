'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Group, Menu, Paper, Progress, Text, Title } from '@mantine/core';
import { IconArchive, IconDotsVertical, IconPlus, IconTarget } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { GoalCategoryIcon } from '@components/GoalCategoryIcon';
import { CmsDialog } from '@components/CmsDialog';
import { GoalDialog } from '../components/GoalDialog';
import styles from './Goals.module.css';
import { useDeleteGoal, useListGoals, useUpdateGoal } from '@core/Goal/infrastructure/goal.hook';
import type { Goal } from '@core/Goal/domain/goal.interface';

export function GoalsTemplate() {
  const [dialog, setDialog] = useState<'add-goal' | 'edit-goal' | ''>('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [deletedGoal, setDeletedGoal] = useState<Goal | null>(null);
  const [actionError, setActionError] = useState('');
  const goalsQuery = useListGoals({ archived: showArchived });
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const visibleGoals = goalsQuery.data?.data ?? [];

  return (
    <CmsPageLayout active="Goals" goalCount={7}>
      <Group justify="space-between" align="center" className={styles.heading}>
        <Box>
          <Title order={1}>My Goals</Title>
          <Text c="dimmed">Break down your life vision into mid-term goals.</Text>
        </Box>
        <Button onClick={() => setDialog('add-goal')}>Add Goal</Button>
      </Group>

      <Group mt="lg" className={styles.filters}>
        <Button variant={showArchived ? 'subtle' : 'light'} onClick={() => setShowArchived(false)}>
          All Goals
        </Button>
        <Button variant={showArchived ? 'light' : 'subtle'} onClick={() => setShowArchived(true)}>
          Archived
        </Button>
        <Text c="dimmed" ml="auto">
          {visibleGoals.length} goals
        </Text>
      </Group>

      {goalsQuery.isError && (
        <Alert color="red" title="Unable to load goals" mb="md">
          Refresh the page or try again later.
        </Alert>
      )}
      {actionError && (
        <Alert color="red" mb="md">
          {actionError}
        </Alert>
      )}
      {goalsQuery.isLoading && (
        <Text c="dimmed" py="lg">
          Loading goals…
        </Text>
      )}

      <Box className={styles.list}>
        {visibleGoals.length === 0 && (
          <Paper className={styles.emptyState}>
            <Box className={styles.emptyIcon}>
              {showArchived ? <IconArchive size={32} stroke={1.5} /> : <IconTarget size={32} stroke={1.5} />}
            </Box>
            <Title order={2}>{showArchived ? 'No archived goals yet' : 'Your next chapter starts with a goal'}</Title>
            <Text c="dimmed">
              {showArchived
                ? 'Goals you archive will appear here. Keep focusing on what matters to you right now.'
                : 'Give your vision a clear direction. Create a goal and take your first step toward it.'}
            </Text>
            <Button
              variant={showArchived ? 'light' : 'filled'}
              leftSection={showArchived ? <IconTarget size={16} /> : <IconPlus size={16} />}
              onClick={() => (showArchived ? setShowArchived(false) : setDialog('add-goal'))}
            >
              {showArchived ? 'Explore your goals' : 'Create your first goal'}
            </Button>
          </Paper>
        )}
        {visibleGoals.map((goal) => {
          const index = visibleGoals.indexOf(goal);
          return (
            <Paper className={styles.goalRow} key={goal.id}>
              <Box className={styles.goalIcon} style={{ backgroundColor: goal.color }}>
                <GoalCategoryIcon index={index} />
              </Box>
              <Box className={styles.goalInfo}>
                <Link href={`/goals/detail?id=${encodeURIComponent(goal.id)}`} className={styles.goalTitle}>
                  {goal.title}
                </Link>
                <Text c="dimmed">{goal.description}</Text>
              </Box>
              <Box className={styles.metrics}>
                <Box className={styles.progress}>
                  <Progress value={goal.progress} color={goal.color} />
                </Box>
                <b>{goal.progress}%</b>
                {goal.archived && (
                  <Text size="xs" c="dimmed">
                    Archived
                  </Text>
                )}
              </Box>
              <Menu position="bottom-end" withinPortal shadow="md" width={170} offset={6}>
                <Menu.Target>
                  <Button variant="subtle" aria-label={`Actions for ${goal.title}`}>
                    <IconDotsVertical size={17} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      setSelectedGoal(goal);
                      setDialog('edit-goal');
                    }}
                  >
                    Edit Goal
                  </Menu.Item>
                  {showArchived ? (
                    <>
                      <Menu.Item
                        onClick={() => {
                          updateGoal.mutate(
                            { id: goal.id, input: { archived: false } },
                            { onError: () => setActionError('Unable to restore this goal. Try again.') }
                          );
                        }}
                      >
                        Restore Goal
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => {
                          setDeletedGoal(goal);
                          setActionError('');
                        }}
                      >
                        Delete Goal
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item
                      onClick={() => {
                        updateGoal.mutate(
                          { id: goal.id, input: { archived: true } },
                          { onError: () => setActionError('Unable to archive this goal. Try again.') }
                        );
                      }}
                    >
                      Archive
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Paper>
          );
        })}
      </Box>

      {dialog && (
        <GoalDialog
          mode={dialog}
          goal={selectedGoal ?? undefined}
          onClose={() => {
            setDialog('');
            setSelectedGoal(null);
          }}
        />
      )}
      {deletedGoal && (
        <CmsDialog
          title="Delete Goal"
          description={`Delete ${deletedGoal.title}?`}
          actionLabel="Delete Goal"
          onClose={() => setDeletedGoal(null)}
          onSubmit={() => {
            deleteGoal.mutate(deletedGoal.id, {
              onSuccess: () => setDeletedGoal(null),
              onError: () => setActionError('This goal could not be deleted. It may still have plans linked to it.'),
            });
          }}
        >
          <Text size="sm">This goal can be deleted after it is archived and all linked plans are removed.</Text>
          {deleteGoal.isError && (
            <Alert color="red" mt="md">
              Unable to delete this goal. Archive it and remove linked plans first.
            </Alert>
          )}
        </CmsDialog>
      )}
    </CmsPageLayout>
  );
}
