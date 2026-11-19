'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Paper,
  Progress,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { GoalCategoryIcon } from '@components/GoalCategoryIcon';
import { useListGoals } from '@core/Goal/infrastructure/goal.hook';
import {
  useCreateWishlistItem,
  useDeleteWishlistItem,
  useGetVision,
  useListWishlist,
  useUpdateWishlistItem,
} from '@core/Vision/infrastructure/vision.hook';
import { VisionDialog } from '../components/VisionDialog';
import { VisionCover } from '../components/VisionCover';
import styles from './Vision.module.css';

export function VisionTemplate() {
  const visionQuery = useGetVision();
  const goalsQuery = useListGoals({ archived: false });
  const wishlistQuery = useListWishlist();
  const createWishlistItem = useCreateWishlistItem();
  const updateWishlistItem = useUpdateWishlistItem();
  const deleteWishlistItem = useDeleteWishlistItem();
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const vision = visionQuery.data?.data;
  const wishlist = wishlistQuery.data?.data ?? [];
  const connectedGoals = [...(goalsQuery.data?.data ?? [])]
    .sort((first, second) => second.progress - first.progress)
    .slice(0, 4);

  const saveWishlistItem = () => {
    const text = draft.trim();
    if (!text) return;
    setActionError('');
    createWishlistItem.mutate(
      { text },
      {
        onSuccess: () => {
          setDraft('');
          setAdding(false);
        },
        onError: () => setActionError('Unable to add this wishlist item.'),
      }
    );
  };

  const isLoading = visionQuery.isLoading || goalsQuery.isLoading || wishlistQuery.isLoading;
  const hasError = visionQuery.isError || goalsQuery.isError || wishlistQuery.isError;

  return (
    <CmsPageLayout active="Vision">
      {hasError && (
        <Alert color="red" mb="md">
          Unable to load vision data. Refresh the page and try again.
        </Alert>
      )}
      {actionError && (
        <Alert color="red" mb="md">
          {actionError}
        </Alert>
      )}
      {isLoading && (
        <Text c="dimmed" mb="md">
          Loading vision…
        </Text>
      )}
      <Paper className={styles.hero}>
        <VisionCover style={vision?.style ?? 'Horizon Line'} />
        <Button className={styles.editVision} variant="default" onClick={() => setDialogOpen(true)}>
          {vision ? 'Edit Vision' : 'Create Vision'}
        </Button>
        <Box className={styles.heroContent}>
          <Badge variant="light">MY LIFE VISION</Badge>
          <Title order={2}>{vision?.title ?? 'No life vision saved'}</Title>
          <Text className={styles.heroDescription}>
            {vision?.description ?? 'Create a long-term vision to give your goals a clear direction.'}
          </Text>
          {vision && (
            <Group className={styles.targets}>
              <Paper>
                <Text c="dimmed">Target Age</Text>
                <b>{vision.targetAge} years old</b>
              </Paper>
              <Paper>
                <Text c="dimmed">Target Year</Text>
                <b>{vision.targetYear}</b>
              </Paper>
            </Group>
          )}
        </Box>
      </Paper>

      <Box className={styles.columns}>
        <Paper className={styles.card}>
          <Group justify="space-between">
            <Box>
              <Title order={3}>Goals Connected to This Vision</Title>
              <Text c="dimmed">Active goals from your account.</Text>
            </Box>
            <Button component={Link} href="/goals" variant="subtle">
              View all goals
            </Button>
          </Group>
          <Box className={styles.connectedList}>
            {connectedGoals.map((goal, iconIndex) => (
              <Paper className={styles.connectedCard} key={goal.id}>
                <Group wrap="nowrap">
                  <Box className={styles.areaIcon} style={{ backgroundColor: goal.color }}>
                    <GoalCategoryIcon index={iconIndex} />
                  </Box>
                  <Anchor component={Link} href={`/goals/detail?id=${encodeURIComponent(goal.id)}`} fw={600}>
                    {goal.title}
                  </Anchor>
                </Group>
                <Group className={styles.progressLine} wrap="nowrap">
                  <Progress value={goal.progress} color={goal.color} />
                  <b>{goal.progress}%</b>
                </Group>
                <Text c="dimmed">{goal.description}</Text>
              </Paper>
            ))}
            {!connectedGoals.length && !goalsQuery.isLoading && <Text c="dimmed">No active goals yet.</Text>}
          </Box>
        </Paper>
        <Paper className={`${styles.card} ${styles.wishlistCard}`}>
          <Title order={3}>Vision Wishlist</Title>
          <Text c="dimmed">Things you want to experience or achieve in your lifetime.</Text>
          <Box className={styles.wishlist}>
            {wishlist.map((item) => (
              <Group key={item.id} justify="space-between" wrap="nowrap" className={styles.wishlistItem}>
                <Checkbox
                  label={item.text}
                  radius="sm"
                  classNames={{ root: styles.wishlistCheckbox, label: styles.wishlistLabel }}
                  styles={{
                    label: {
                      textDecoration: item.checked ? 'line-through' : undefined,
                      color: item.checked ? '#8392a7' : '#34445a',
                    },
                  }}
                  checked={item.checked}
                  disabled={updateWishlistItem.isPending}
                  onChange={(event) =>
                    updateWishlistItem.mutate(
                      { id: item.id, input: { checked: event.currentTarget.checked } },
                      { onError: () => setActionError('Unable to update this wishlist item.') }
                    )
                  }
                />
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="lg"
                  radius="md"
                  disabled={deleteWishlistItem.isPending}
                  aria-label={`Delete ${item.text}`}
                  onClick={() =>
                    deleteWishlistItem.mutate(item.id, {
                      onError: () => setActionError('Unable to delete this wishlist item.'),
                    })
                  }
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
            {!wishlist.length && !wishlistQuery.isLoading && <Text c="dimmed">Your wishlist is empty.</Text>}
          </Box>
          {adding ? (
            <Box className={styles.draft}>
              <TextInput
                autoFocus
                label="Wishlist item"
                aria-label="Wishlist item"
                value={draft}
                placeholder="Add wishlist item"
                onChange={(event) => setDraft(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') saveWishlistItem();
                  if (event.key === 'Escape') {
                    setDraft('');
                    setAdding(false);
                  }
                }}
              />
              <Text c="dimmed" size="xs">
                Press Enter to save
              </Text>
              <Group justify="flex-end">
                <Button
                  variant="subtle"
                  onClick={() => {
                    setDraft('');
                    setAdding(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveWishlistItem} loading={createWishlistItem.isPending}>
                  Add Item
                </Button>
              </Group>
            </Box>
          ) : (
            <Button
              variant="light"
              fullWidth
              mt="md"
              leftSection={<IconPlus size={16} />}
              onClick={() => setAdding(true)}
            >
              Add Wishlist
            </Button>
          )}
        </Paper>
      </Box>

      {dialogOpen && <VisionDialog vision={vision} onClose={() => setDialogOpen(false)} />}
    </CmsPageLayout>
  );
}
