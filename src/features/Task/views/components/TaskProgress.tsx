'use client';

import { useState } from 'react';
import { Badge, Button, Group, Menu, NumberInput, Progress, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { CmsDialog } from '@components/CmsDialog';
import { taskProgress, taskStatus, taskStatuses, taskStatusColors, updateTaskProgress, type Task } from '../data/tasks';
import { useUpdateTask } from '@core/Task/infrastructure/task.hook';
import { useTasks } from '../data/taskStore';

export function TaskStatusBadge({ task }: { task: Task }) {
  const status = taskStatus(task);
  const updateTask = useUpdateTask();
  const due = task.effectiveDue ?? task.due;
  const overdue = Boolean(due && new Date().getTime() > new Date(`${due}T23:59:59.999Z`).getTime());
  return (
    <Stack gap={4} align="flex-start" onClick={(event) => event.stopPropagation()}>
      <Menu withinPortal position="bottom-end" shadow="md">
        <Menu.Target>
          <UnstyledButton aria-label={`Change status for ${task.title}`} disabled={updateTask.isPending}>
            <Badge
              component="span"
              variant="light"
              color={taskStatusColors[status]}
              rightSection={<IconChevronDown size={12} />}
            >
              {status}
            </Badge>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Change status</Menu.Label>
          {taskStatuses.map((value) => (
            <Menu.Item
              key={value}
              color={taskStatusColors[value]}
              leftSection={task.manualStatus === value ? <IconCheck size={14} /> : undefined}
              disabled={
                updateTask.isPending ||
                (overdue &&
                  (value === 'To Do' ||
                    value === 'In Progress' ||
                    (value === 'Failed' && task.target > 0 && taskProgress(task) >= task.successThreshold)))
              }
              onClick={() => updateTask.mutate({ id: task.id, input: { manualStatus: value } })}
            >
              {value}
            </Menu.Item>
          ))}
          <Menu.Divider />
          {overdue && (
            <Menu.Label>
              Deadline passed: status follows progress.
              <br />
              Manual completion is kept.
            </Menu.Label>
          )}
          <Menu.Item
            leftSection={!task.manualStatus ? <IconCheck size={14} /> : undefined}
            disabled={updateTask.isPending}
            onClick={() => updateTask.mutate({ id: task.id, input: { manualStatus: null } })}
          >
            Automatic
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {updateTask.isError && (
        <Text size="xs" c="red">
          Unable to update status. Please try again.
        </Text>
      )}
    </Stack>
  );
}

export function TaskProgress({ task }: { task: Task }) {
  const [, setTasks] = useTasks();
  const [opened, setOpened] = useState(false);
  const [current, setCurrent] = useState(task.current);
  const [target, setTarget] = useState(task.target);
  const [threshold, setThreshold] = useState(task.successThreshold);
  const percent = taskProgress(task);
  return (
    <>
      <Stack gap={4} miw={130}>
        <Group gap={4} justify="flex-start" wrap="nowrap">
          <Button
            variant="subtle"
            size="compact-xs"
            onClick={() => {
              setCurrent(task.current);
              setTarget(task.target);
              setThreshold(task.successThreshold);
              setOpened(true);
            }}
          >
            {task.current}/{task.target} ({Math.round(percent)}%)
          </Button>
        </Group>
        <Progress value={Math.min(100, percent)} size="xs" color={taskStatusColors[taskStatus(task)]} />
        <Text size="10px" c="dimmed">
          Success at {task.successThreshold}%
        </Text>
      </Stack>
      {opened && (
        <CmsDialog
          title="Update task progress"
          description={task.title}
          actionLabel="Save Progress"
          onClose={() => setOpened(false)}
          onSubmit={() => {
            if (
              !Number.isFinite(current) ||
              current < 0 ||
              !Number.isFinite(target) ||
              target <= 0 ||
              threshold <= 0 ||
              threshold > 100
            )
              return;
            setTasks((items) =>
              items.map((item) =>
                item.id === task.id ? updateTaskProgress(item, { current, target, successThreshold: threshold }) : item
              )
            );
            setOpened(false);
          }}
        >
          <Group grow align="flex-start">
            <NumberInput
              label="Current amount"
              required
              min={0}
              value={current}
              onChange={(value) => setCurrent(Number(value))}
            />
            <NumberInput
              label="Target amount"
              required
              min={0.01}
              value={target}
              onChange={(value) => setTarget(Number(value))}
            />
          </Group>
          <NumberInput
            label="Minimum success (%)"
            description="The task is completed when progress reaches this percentage."
            required
            min={1}
            max={100}
            value={threshold}
            onChange={(value) => setThreshold(Number(value))}
          />
          <Text size="sm" c="dimmed">
            {target > 0 ? Math.round((current / target) * 100) : 0}% progress. Reaching the minimum success percentage
            completes the task, even after its due date.
          </Text>
          {task.effectiveDue && (
            <Text size="xs" c="dimmed">
              Automatic deadline: {task.effectiveDue}. Manual completion is kept after the deadline.
            </Text>
          )}
        </CmsDialog>
      )}
    </>
  );
}
