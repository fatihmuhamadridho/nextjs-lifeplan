'use client';

import type { ReactNode } from 'react';
import { Box, Button, Group, Paper, Text, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import styles from './CmsDialog.module.css';

type CmsDialogProps = {
  title: string;
  description: string;
  actionLabel: string;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  dialogClassName?: string;
};

export function CmsDialog({
  title,
  description,
  actionLabel,
  children,
  onClose,
  onSubmit,
  dialogClassName,
}: CmsDialogProps) {
  return (
    <Box className={styles.overlay} onClick={onClose}>
      <Paper
        className={dialogClassName ? `${styles.dialog} ${dialogClassName}` : styles.dialog}
        component="form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cms-dialog-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Title id="cms-dialog-title" order={3}>
              {title}
            </Title>
            <Text c="dimmed" mt={4} size="13px" lh={1.5}>
              {description}
            </Text>
          </Box>
          <Button
            type="button"
            variant="subtle"
            aria-label="Close dialog"
            onClick={onClose}
            p={0}
            w={30}
            miw={30}
            h={30}
            style={{ flexShrink: 0 }}
          >
            <IconX size={18} />
          </Button>
        </Group>
        <Box className={styles.fields}>{children}</Box>
        <Group justify="flex-end" className={styles.actions}>
          <Button type="button" variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{actionLabel}</Button>
        </Group>
      </Paper>
    </Box>
  );
}
