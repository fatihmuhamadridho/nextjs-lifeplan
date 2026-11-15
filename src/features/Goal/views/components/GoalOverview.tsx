import Link from 'next/link';
import { Anchor, Box, Button, Group, Paper, Progress, SimpleGrid, Text, Title } from '@mantine/core';
import { goalMilestones } from '../data/goals';

export function GoalOverview({ onViewPlans }: { onViewPlans: () => void }) {
  const active = goalMilestones.filter((plan) => plan.progress > 0 && plan.progress < 100);
  const previews = [...active].sort((first, second) => second.progress - first.progress).slice(0, 2);
  return (
    <Box mt="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {[
          ['Total plans', goalMilestones.length],
          ['In progress', active.length],
          ['Completed', goalMilestones.filter((plan) => plan.progress === 100).length],
        ].map(([label, value]) => (
          <Paper key={label} withBorder radius="lg" p="lg">
            <Text c="dimmed" size="sm">
              {label}
            </Text>
            <Title order={2} mt="xs">
              {value}
            </Title>
          </Paper>
        ))}
      </SimpleGrid>
      <Paper withBorder radius="lg" p="lg" mt="lg">
        <Group justify="space-between" mb="lg">
          <Title order={3}>Plans in progress</Title>
          <Button variant="light" onClick={onViewPlans}>
            View all plans
          </Button>
        </Group>
        {previews.length ? (
          previews.map((plan) => (
            <Box key={plan.title} mb="lg">
              <Group justify="space-between">
                <Anchor component={Link} href="/plans/detail" fw={600}>
                  {plan.title}
                </Anchor>
                <Text fw={600}>{plan.progress}%</Text>
              </Group>
              <Text c="dimmed" size="sm" mb="sm">
                {plan.timeline}
              </Text>
              <Progress value={plan.progress} color="teal" />
            </Box>
          ))
        ) : (
          <Text c="dimmed">No plans in progress. Open Plans to create your next milestone.</Text>
        )}
      </Paper>
    </Box>
  );
}
