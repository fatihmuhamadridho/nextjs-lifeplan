'use client';

import { useState } from 'react';
import { Alert, Box, Group, NumberInput, Radio, SimpleGrid, Text, TextInput, Textarea } from '@mantine/core';
import { CmsDialog } from '@components/CmsDialog';
import type { Vision } from '@core/Vision/domain/vision.interface';
import { useSaveVision } from '@core/Vision/infrastructure/vision.hook';
import { VisionCover, visionCoverStyles } from './VisionCover';
import styles from './VisionDialog.module.css';

export function VisionDialog({ vision, onClose }: { vision?: Vision | null; onClose: () => void }) {
  const saveVision = useSaveVision();
  const [title, setTitle] = useState(vision?.title ?? '');
  const [description, setDescription] = useState(vision?.description ?? '');
  const [targetAge, setTargetAge] = useState<number | string>(vision?.targetAge ?? 0);
  const [targetYear, setTargetYear] = useState<number | string>(vision?.targetYear ?? new Date().getFullYear());
  const [style, setStyle] = useState(vision?.style ?? 'Horizon Line');
  const [error, setError] = useState('');

  return (
    <CmsDialog
      dialogClassName={styles.dialog}
      title="Edit Life Vision"
      description="Update your long-term vision, target age, and statement."
      actionLabel="Save Changes"
      onClose={onClose}
      onSubmit={() => {
        if (
          !title.trim() ||
          !description.trim() ||
          Number(targetAge) < 1 ||
          Number(targetYear) < new Date().getFullYear() ||
          !style
        ) {
          setError('Complete each field with a valid target age and year.');
          return;
        }
        saveVision.mutate(
          {
            title: title.trim(),
            description: description.trim(),
            targetAge: Number(targetAge),
            targetYear: Number(targetYear),
            style,
          },
          { onSuccess: onClose, onError: () => setError('Unable to save your vision. Try again.') }
        );
      }}
    >
      {error && <Alert color="red">{error}</Alert>}
      <TextInput
        label="Vision title"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        required
        maxLength={60}
      />
      <Textarea
        label="Vision description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        required
        maxLength={280}
        minRows={3}
      />
      <NumberInput label="Target age" value={targetAge} onChange={setTargetAge} min={1} required />
      <NumberInput
        label="Target year"
        value={targetYear}
        onChange={setTargetYear}
        min={new Date().getFullYear()}
        required
      />
      <Radio.Group label="Cover banner style" value={style} onChange={setStyle} required>
        <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="xs" mt="xs">
          {visionCoverStyles.map((option) => (
            <Radio.Card key={option} value={option} radius="md" style={{ overflow: 'hidden' }}>
              <Box pos="relative" h={72}>
                <VisionCover style={option} />
              </Box>
              <Group gap={6} p="xs" wrap="nowrap">
                <Radio.Indicator size="xs" />
                <Text size="xs" fw={500}>
                  {option}
                </Text>
              </Group>
            </Radio.Card>
          ))}
        </SimpleGrid>
      </Radio.Group>
      {saveVision.isPending && <Alert color="blue">Saving vision…</Alert>}
    </CmsDialog>
  );
}
