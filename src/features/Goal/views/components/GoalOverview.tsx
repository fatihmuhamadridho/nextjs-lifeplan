import Link from 'next/link';
import { ActionIcon, Anchor, Box, Button, Group, Menu, Paper, Progress, SimpleGrid, Text, Title } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import type { GoalMilestone } from '../data/goalMilestoneStore';

type GoalOverviewProps = {
  milestones: GoalMilestone[];
  onViewPlans: () => void;
  onEditPlan: (milestone: GoalMilestone) => void;
  onDeletePlan: (milestone: GoalMilestone) => void;
};

export function GoalOverview({ milestones, onViewPlans, onEditPlan, onDeletePlan }: GoalOverviewProps) {
  const active = milestones.filter((plan) => plan.progress > 0 && plan.progress < 100);
  const previews = [...active].sort((first, second) => second.progress - first.progress).slice(0, 2);
  return (
    <Box mt="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {[
          ['Total plans', milestones.length],
          ['In progress', active.length],
          ['Completed', milestones.filter((plan) => plan.progress === 100).length],
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
              <Group justify="space-between" wrap="nowrap">
                <Anchor component={Link} href="/plans/detail" fw={600}>
                  {plan.title}
                </Anchor>
                <Group gap="xs" wrap="nowrap">
                  <Text fw={600}>{plan.progress}%</Text>
                  <Menu position="bottom-end" shadow="md" withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" aria-label={`More options for ${plan.title}`}>
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => onEditPlan(plan)}>Edit Plan</Menu.Item>
                      <Menu.Item color="red" onClick={() => onDeletePlan(plan)}>
                        Delete Plan
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
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
