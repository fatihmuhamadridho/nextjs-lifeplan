'use client';
import { useState } from 'react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { IconDotsVertical, IconPencil, IconTrash } from '@tabler/icons-react';
import { CmsDialog } from '@components/CmsDialog';
import type { Task } from '../data/tasks';
import { useTasks } from '../data/taskStore';
import { TaskCreateDialog } from './TaskCreateDialog';

export function TaskActions({ task }: { task: Task }) {
  const [, setTasks] = useTasks();
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null);
  return (
    <>
      <Menu position="bottom-end" withinPortal shadow="md">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" aria-label={`Actions for ${task.title}`}>
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconPencil size={15} />} onClick={() => setDialog('edit')}>
            Edit Task
          </Menu.Item>
          <Menu.Item color="red" leftSection={<IconTrash size={15} />} onClick={() => setDialog('delete')}>
            Delete Task
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {dialog === 'edit' && <TaskCreateDialog task={task} onClose={() => setDialog(null)} />}
      {dialog === 'delete' && (
        <CmsDialog
          title="Delete Task"
          description={task.title}
          actionLabel="Delete Task"
          onClose={() => setDialog(null)}
          onSubmit={() => {
            setTasks((items) => items.filter((item) => item.id !== task.id));
            setDialog(null);
          }}
        >
          <Text size="sm">This task will be removed from all pages.</Text>
        </CmsDialog>
      )}
    </>
  );
}
