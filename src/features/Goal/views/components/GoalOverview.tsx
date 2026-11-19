import Link from 'next/link';
import { ActionIcon, Anchor, Box, Button, Group, Menu, Paper, Progress, SimpleGrid, Text, Title } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import type { Milestone as GoalMilestone } from '@core/Goal/domain/goal.interface';
import type { Plan as PlanItem } from '@core/Plan/domain/plan.interface';

type GoalOverviewProps = {
  milestones: GoalMilestone[];
  plans: PlanItem[];
  onViewPlans: () => void;
  onEditPlan: (milestone: GoalMilestone) => void;
  onDeletePlan: (milestone: GoalMilestone) => void;
};

export function GoalOverview({ milestones, plans, onViewPlans, onEditPlan, onDeletePlan }: GoalOverviewProps) {
  const active = milestones.filter((milestone) => milestone.progress > 0 && milestone.progress < 100);
  const previews = [...active].sort((first, second) => second.progress - first.progress).slice(0, 2);

  return (
    <Box mt="lg">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {[
          ['Total plans', milestones.length],
          ['In progress', active.length],
          ['Completed', milestones.filter((milestone) => milestone.progress === 100).length],
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
          previews.map((milestone) => {
            const plan = plans.find((item) => item.name === milestone.title);
            return (
              <Box key={milestone.id} mb="lg">
                <Group justify="space-between" wrap="nowrap">
                  {plan ? (
                    <Anchor component={Link} href={`/plans/detail?id=${encodeURIComponent(plan.id)}`} fw={600}>
                      {milestone.title}
                    </Anchor>
                  ) : (
                    <Text fw={600}>{milestone.title}</Text>
                  )}
                  <Group gap="xs" wrap="nowrap">
                    <Text fw={600}>{milestone.progress}%</Text>
                    <Menu position="bottom-end" shadow="md" withinPortal>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" aria-label={`More options for ${milestone.title}`}>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item onClick={() => onEditPlan(milestone)}>Edit {plan ? 'Plan' : 'Milestone'}</Menu.Item>
                        <Menu.Item color="red" onClick={() => onDeletePlan(milestone)}>
                          Delete {plan ? 'Plan' : 'Milestone'}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Group>
                <Text c="dimmed" size="sm" mb="sm">
                  {milestone.timeline}
                </Text>
                <Progress value={milestone.progress} color="teal" />
              </Box>
            );
          })
        ) : (
          <Text c="dimmed">No plans in progress. Create your next plan from the Plans tab.</Text>
        )}
      </Paper>
    </Box>
  );
}
