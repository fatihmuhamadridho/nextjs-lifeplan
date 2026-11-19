import type { ReactNode } from 'react';
import { Box, Button, Group, Paper, Progress, SimpleGrid, Text, Title } from '@mantine/core';
import { weekDateRange } from '../utils/weekDateRange';
import type { Week } from '@core/Plan/domain/plan.interface';

import { taskStatus, type Task } from '@features/Task/views/data/tasks';

export function PlanOverview({
  tasks,
  weeks,
  renderTasks,
  onViewWeeks,
  renderWeekActions,
}: {
  tasks: Task[];
  weeks: Week[];
  renderTasks: (week: string, preview?: boolean) => ReactNode;
  onViewWeeks: () => void;
  renderWeekActions: (week: Week) => ReactNode;
}) {
  const completed = tasks.filter((task) => taskStatus(task) === 'Completed').length;
  const percentage = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const current =
    weeks.find((week) => week.start <= today && week.end >= today) ?? weeks.find((week) => week.start > today);
  const currentTasks = tasks.filter((task) => task.week === current?.week);
  const currentCompleted = currentTasks.filter((task) => taskStatus(task) === 'Completed').length;
  return (
    <Box mt="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {[
          ['Total weeks', weeks.length],
          ['Tasks completed', `${completed}/${tasks.length}`],
          ['Task completion', `${percentage}%`],
        ].map(([label, value]) => (
          <Paper key={label} withBorder radius="lg" p="lg">
            <Text c="dimmed" size="12px">
              {label}
            </Text>
            <Title order={2} size={24} mt="xs">
              {value}
            </Title>
          </Paper>
        ))}
      </SimpleGrid>
      <Paper withBorder radius="lg" p="lg" mt="lg">
        <Group justify="space-between" mb="md">
          <Box>
            <Title order={3} size={20}>
              Current Week{current ? ` · ${current.week}` : ''}
            </Title>
            <Text c="dimmed" size="12px">
              {current ? weekDateRange(current) : 'No week scheduled'}
            </Text>
          </Box>
          <Group gap="sm">
            <Button variant="light" onClick={onViewWeeks}>
              View weekly plans
            </Button>
            {current && renderWeekActions(current)}
          </Group>
        </Group>
        {current && (
          <>
            <Group justify="space-between" mb="xs">
              <Text size="12px">Weekly progress</Text>
              <Text size="12px">
                {currentCompleted}/{currentTasks.length} tasks completed
              </Text>
            </Group>
            <Progress
              value={currentTasks.length ? (currentCompleted / currentTasks.length) * 100 : 0}
              color="teal"
              mb="lg"
            />
            {currentTasks.some((task) => taskStatus(task) !== 'Completed') ? (
              renderTasks(current.week, true)
            ) : (
              <Text c="teal" size="13px">
                All tasks for this week are complete.
              </Text>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
