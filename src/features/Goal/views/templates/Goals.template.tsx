'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Box, Button, Group, Paper, Progress, Text, Title } from '@mantine/core';
import { IconArchive, IconDotsVertical, IconPlus, IconTarget } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { GoalCategoryIcon } from '@components/GoalCategoryIcon';
import { goals } from '../data/goals';
import { GoalDialog } from '../components/GoalDialog';
import styles from './Goals.module.css';

export function GoalsTemplate() {
  const [dialog, setDialog] = useState<'add-goal' | 'edit-goal' | ''>('');
  const [openMenu, setOpenMenu] = useState(-1);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedGoals, setArchivedGoals] = useState<string[]>([]);
  const [pausedGoals, setPausedGoals] = useState<string[]>([]);
  const visibleGoals = goals.filter((goal) =>
    showArchived ? archivedGoals.includes(goal.title) : !archivedGoals.includes(goal.title)
  );

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
          const index = goals.indexOf(goal);
          return (
            <Paper className={styles.goalRow} key={goal.title}>
              <Box className={styles.goalIcon} style={{ backgroundColor: goal.color }}>
                <GoalCategoryIcon index={index} />
              </Box>
              <Box className={styles.goalInfo}>
                <Link href="/goals/detail" className={styles.goalTitle}>
                  {goal.title}
                </Link>
                <Text c="dimmed">{goal.description}</Text>
              </Box>
              <Box className={styles.progress}>
                <Progress
                  value={goal.progress}
                  color={
                    pausedGoals.includes(goal.title)
                      ? 'gray'
                      : ['teal', 'teal', 'orange', 'blue', 'red', 'teal', 'orange'][index]
                  }
                />
              </Box>
              <b>{goal.progress}%</b>
              <Badge variant="light">Dec 2030</Badge>
              <Button
                variant="subtle"
                aria-label={`Actions for ${goal.title}`}
                onClick={() => setOpenMenu(openMenu === index ? -1 : index)}
              >
                <IconDotsVertical size={17} />
              </Button>
              {openMenu === index && (
                <Paper className={styles.menu}>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      setDialog('edit-goal');
                      setOpenMenu(-1);
                    }}
                  >
                    Edit Goal
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() =>
                      setPausedGoals(
                        pausedGoals.includes(goal.title)
                          ? pausedGoals.filter((title) => title !== goal.title)
                          : [...pausedGoals, goal.title]
                      )
                    }
                  >
                    {pausedGoals.includes(goal.title) ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    variant="subtle"
                    onClick={() => {
                      setArchivedGoals([...archivedGoals, goal.title]);
                      setOpenMenu(-1);
                    }}
                  >
                    Archive
                  </Button>
                </Paper>
              )}
            </Paper>
          );
        })}
      </Box>

      {dialog && <GoalDialog mode={dialog} onClose={() => setDialog('')} />}
    </CmsPageLayout>
  );
}
