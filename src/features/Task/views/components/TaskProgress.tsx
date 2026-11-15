'use client';

import { useState } from 'react';
import { Badge, Button, Group, NumberInput, Progress, Stack, Text } from '@mantine/core';
import { CmsDialog } from '@components/CmsDialog';
import { taskProgress, taskStatus, taskStatusColors, updateTaskProgress, type Task } from '../data/tasks';
import { TaskActions } from './TaskActions';
import { useTasks } from '../data/taskStore';

export function TaskStatusBadge({ task }: { task: Task }) {
  const status = taskStatus(task);
  return (
    <Badge variant="light" color={taskStatusColors[status]}>
      {status}
    </Badge>
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
        <Group gap={4} justify="space-between" wrap="nowrap">
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
          <TaskActions task={task} />
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
            description="The task succeeds when progress reaches this percentage by its due date."
            required
            min={1}
            max={100}
            value={threshold}
            onChange={(value) => setThreshold(Number(value))}
          />
          <Text size="sm" c="dimmed">
            {target > 0 ? Math.round((current / target) * 100) : 0}% progress. Updates after the deadline do not change
            a failed task into completed.
          </Text>
        </CmsDialog>
      )}
    </>
  );
}
