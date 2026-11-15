import Link from 'next/link';
import { Anchor, Badge, Box, Group, Paper, Progress, SimpleGrid, Table, Text, Title } from '@mantine/core';
import { goals } from '@features/Goal/views/data/goals';
import { plans } from '@features/Plan/views/data/plans';
import { taskStatus, taskStatuses } from '@features/Task/views/data/tasks';
import { useTasks } from '@features/Task/views/data/taskStore';
import { TaskProgress, TaskStatusBadge } from '@features/Task/views/components/TaskProgress';

export function EntityReport({ category }: { category: string }) {
  const [tasks] = useTasks();
  const isGoals = category === 'Goals';
  const isTasks = category === 'Tasks';
  const entries = isGoals ? goals : plans;
  const total = isTasks ? tasks.length : entries.length;
  const completed = isTasks
    ? tasks.filter((task) => taskStatus(task) === 'Completed').length
    : entries.filter((entry) => entry.progress === 100).length;
  const average = isTasks
    ? total
      ? Math.round((completed / total) * 100)
      : 0
    : total
      ? Math.round(entries.reduce((sum, entry) => sum + entry.progress, 0) / total)
      : 0;
  const ranked = [...entries].sort((first, second) => second.progress - first.progress);
  const surface = { border: '1px solid #e5eaf1', background: '#fff' };

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Box>
          <Title order={2} size={22}>
            {category} Report
          </Title>
          <Text c="dimmed" size="sm">
            {isTasks
              ? 'Review completion, priorities, and the plans behind your tasks.'
              : `See how your ${category.toLowerCase()} are progressing and where to focus next.`}
          </Text>
        </Box>
        <Badge variant="light">Current snapshot</Badge>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {[
          [`Total ${category.toLowerCase()}`, total],
          ...(isTasks
            ? taskStatuses.map((status) => [status, tasks.filter((task) => taskStatus(task) === status).length])
            : [['Completed', completed]]),
          [isTasks ? 'Completion rate' : 'Average progress', `${average}%`],
        ].map(([label, value]) => (
          <Paper key={label} p="lg" radius="lg" style={surface}>
            <Text c="dimmed" size="sm">
              {label}
            </Text>
            <Title order={2} size={28} mt="sm">
              {value}
            </Title>
          </Paper>
        ))}
      </SimpleGrid>
      <Paper p="lg" radius="lg" mt="lg" style={surface}>
        <Title size={20} order={3} mb="xs">
          {isTasks ? 'Task priorities' : `${category} progress comparison`}
        </Title>
        <Text c="dimmed" size="sm" mb="lg">
          {isTasks ? 'Outstanding work grouped by priority.' : 'Ordered from highest to lowest progress.'}
        </Text>
        {isTasks ? (
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            {['High', 'Medium', 'Low'].map((priority) => {
              const count = tasks.filter(
                (task) => task.priority === priority && ['To Do', 'In Progress'].includes(taskStatus(task))
              ).length;
              return (
                <Paper key={priority} withBorder p="md" radius="md">
                  <Badge
                    variant="light"
                    color={priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'gray'}
                  >
                    {priority}
                  </Badge>
                  <Title size={20} order={3} mt="sm">
                    {count} to do
                  </Title>
                </Paper>
              );
            })}
          </SimpleGrid>
        ) : (
          ranked.map((entry) => (
            <Box key={'title' in entry ? entry.title : entry.name} mb="md">
              <Group justify="space-between" mb={6}>
                <Text size="sm" fw={600}>
                  {'title' in entry ? entry.title : entry.name}
                </Text>
                <Text size="sm">{entry.progress}%</Text>
              </Group>
              <Progress value={entry.progress} color={entry.progress === 100 ? 'teal' : 'blue'} />
            </Box>
          ))
        )}
      </Paper>
      <Paper radius="lg" mt="lg" style={{ ...surface, overflow: 'hidden' }}>
        <Box p="lg">
          <Title size={20} order={3}>
            {category} breakdown
          </Title>
        </Box>
        <Table.ScrollContainer type="native" minWidth={750}>
          <Table fz="sm" horizontalSpacing="lg" verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {(isTasks
                  ? ['Task', 'Plan', 'Priority', 'Due date', 'Progress', 'Status']
                  : isGoals
                    ? ['Goal', 'Progress', 'Status']
                    : ['Plan', 'Goal', 'Timeline', 'Progress', 'Status']
                ).map((column) => (
                  <Table.Th key={column}>{column}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isTasks
                ? tasks.map((task) => (
                    <Table.Tr key={task.id}>
                      <Table.Td>{task.title}</Table.Td>
                      <Table.Td>{task.plan}</Table.Td>
                      <Table.Td>{task.priority}</Table.Td>
                      <Table.Td>{task.due || 'No due date'}</Table.Td>
                      <Table.Td>
                        <TaskProgress task={task} />
                      </Table.Td>
                      <Table.Td>
                        <TaskStatusBadge task={task} />
                      </Table.Td>
                    </Table.Tr>
                  ))
                : ranked.map((entry) => (
                    <Table.Tr key={'title' in entry ? entry.title : entry.name}>
                      <Table.Td>
                        <Anchor component={Link} href={isGoals ? '/goals/detail' : '/plans/detail'} size="sm">
                          {'title' in entry ? entry.title : entry.name}
                        </Anchor>
                      </Table.Td>
                      {'goal' in entry && (
                        <>
                          <Table.Td>{entry.goal}</Table.Td>
                          <Table.Td>{entry.timeline}</Table.Td>
                        </>
                      )}
                      <Table.Td>{entry.progress}%</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color={entry.progress === 100 ? 'teal' : 'blue'}>
                          {'status' in entry
                            ? entry.status
                            : entry.progress === 100
                              ? 'Completed'
                              : entry.progress > 0
                                ? 'In progress'
                                : 'Not started'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {!total && (
          <Text p="lg" c="dimmed">
            No data available yet.
          </Text>
        )}
      </Paper>
    </Box>
  );
}
