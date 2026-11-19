'use client';
import { useState } from 'react';
import { Box, NumberInput, Select, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { CmsDialog } from '@components/CmsDialog';
import { updateTaskProgress, type Task } from '../data/tasks';
import { useTasks } from '../data/taskStore';
import { useListPlans, useListWeeks } from '@core/Plan/infrastructure/plan.hook';
import styles from '../templates/Tasks.module.css';
export function TaskCreateDialog({
  onClose,
  linkedPlan,
  week,
  task,
}: {
  onClose: () => void;
  linkedPlan?: string;
  week?: string;
  task?: Task;
}) {
  const [, setTasks] = useTasks();
  const plansQuery = useListPlans();
  const plans = plansQuery.data?.data ?? [];
  const [assignedWeek, setAssignedWeek] = useState<string | null>(task?.week ?? week ?? null);
  const [title, setTitle] = useState(task?.title ?? '');
  const [plan, setPlan] = useState(task?.plan ?? linkedPlan ?? '');
  const selectedPlan = plans.find((item) => item.name === plan);
  const weeksQuery = useListWeeks({ planId: selectedPlan?.id }, Boolean(selectedPlan));
  const weeks = (weeksQuery.data?.data ?? []).filter((item) => item.planId === selectedPlan?.id);
  const [due, setDue] = useState<string | null>(task?.due ?? null);
  const [priority, setPriority] = useState<string | null>(task?.priority ?? 'Medium');
  const [target, setTarget] = useState<number | string>(task?.target ?? 10);
  const [threshold, setThreshold] = useState<number | string>(task?.successThreshold ?? 40);

  const [current, setCurrent] = useState<number | string>(task?.current ?? 0);
  return (
    <CmsDialog
      title={task ? 'Edit Task' : 'Add Task'}
      description={week ? `Create a task for ${week}.` : 'Create an action to move your plan forward.'}
      actionLabel={task ? 'Save Changes' : 'Create Task'}
      dialogClassName={styles.taskDialog}
      onClose={onClose}
      onSubmit={() => {
        if (!title.trim() || Number(target) <= 0 || Number(threshold) < 1 || Number(threshold) > 100) return;
        if (task) {
          setTasks((items) =>
            items.map((item) =>
              item.id === task.id
                ? updateTaskProgress(item, {
                    title: title.trim(),
                    plan,
                    week: assignedWeek ?? undefined,
                    due,
                    priority: (priority || 'Medium') as Task['priority'],
                    current: Number(current),
                    target: Number(target),
                    successThreshold: Number(threshold),
                  })
                : item
            )
          );
          onClose();
          return;
        }
        setTasks((items) => [
          ...items,
          {
            id: crypto.randomUUID(),
            title: title.trim(),
            plan: plan.trim(),
            week: assignedWeek ?? undefined,
            due,
            priority: (priority || 'Medium') as Task['priority'],
            current: 0,
            target: Number(target),
            successThreshold: Number(threshold),
            reachedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        onClose();
      }}
    >
      <Box className={styles.taskForm}>
        <TextInput
          label="Task title"
          required
          maxLength={2000}
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="What needs to get done?"
        />
        <Select
          label="Linked plan"
          disabled={Boolean(linkedPlan)}
          value={plan}
          onChange={(value) => {
            setPlan(value || '');
            setAssignedWeek(null);
          }}
          data={plans.map((item) => item.name)}
          searchable
          clearable
          placeholder="Select a plan"
        />
        <Select
          label="Weekly plan"
          data={weeks.map((item) => item.week)}
          value={assignedWeek}
          onChange={setAssignedWeek}
          placeholder="No week assigned"
          clearable
          disabled={Boolean(week)}
        />
        <TextInput
          label="Linked goal"
          value={plans.find((item) => item.name === plan)?.goal || ''}
          readOnly
          className={styles.linkedGoal}
          placeholder="Automatically follows the selected plan"
        />
        <Box className={styles.formColumns}>
          <DatePickerInput label="Due date" value={due} onChange={setDue} clearable placeholder="Select date" />
          <Select
            label="Priority"
            data={['Low', 'Medium', 'High']}
            value={priority}
            onChange={setPriority}
            allowDeselect={false}
          />
        </Box>
        <Box className={styles.progressSettings}>
          <Text fw={600} size="13px">
            Success criteria
          </Text>
          {task && <NumberInput label="Current amount" required min={0} value={current} onChange={setCurrent} />}
          <Box className={styles.formColumns}>
            <NumberInput label="Target amount" required min={0.01} value={target} onChange={setTarget} />
            <NumberInput
              label="Minimum success (%)"
              required
              min={1}
              max={100}
              value={threshold}
              onChange={setThreshold}
            />
          </Box>
          <Text size="12px" c="dimmed" lh={1.5}>
            Target amount is the total you aim for, such as 10 sessions or 10 pages.
          </Text>
          <Text size="12px" c="dimmed" lh={1.5}>
            Progress {Number(current) || 0}/{Number(target) || 0}. Reach {Number(threshold) || 0}% to complete this
            task, even after its due date.
          </Text>
        </Box>
      </Box>
    </CmsDialog>
  );
}
