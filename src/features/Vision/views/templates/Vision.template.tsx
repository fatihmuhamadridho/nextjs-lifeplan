'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, Box, Button, Group, Paper, Progress, Text, Title } from '@mantine/core';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { GoalCategoryIcon } from '@components/GoalCategoryIcon';
import { goals } from '@features/Goal/views/data/goals';
import { VisionDialog } from '../components/VisionDialog';
import styles from './Vision.module.css';

const connectedGoals = goals
  .map((goal, iconIndex) => ({ ...goal, iconIndex }))
  .sort((first, second) => second.progress - first.progress)
  .slice(0, 4);

export function VisionTemplate() {
  const [wishlist, setWishlist] = useState([
    'Travel to Japan with family',
    'Build a house for parents',
    'Have multiple income streams',
    'Stay healthy and active',
    'Be a good role model for my child',
  ]);
  const [checkedItems, setCheckedItems] = useState(['Travel to Japan with family', 'Build a house for parents']);
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const saveWishlistItem = () => {
    const item = draft.trim();
    if (!item) return;
    setWishlist((items) => [...items, item]);
    setDraft('');
    setAdding(false);
  };

  return (
    <CmsPageLayout active="Vision">
      <Paper className={styles.hero}>
        <Button className={styles.editVision} variant="default" onClick={() => setDialogOpen(true)}>
          Edit Vision
        </Button>
        <Badge variant="light">MY LIFE VISION</Badge>
        <Title order={2}>Financial Freedom at 60</Title>
        <Text className={styles.heroDescription}>
          Have enough passive income to live comfortably, travel with family, stay healthy, and live a meaningful life.
        </Text>
        <Group className={styles.targets}>
          <Paper>
            <Text c="dimmed">Target Age</Text>
            <b>60 years old</b>
          </Paper>
          <Paper>
            <Text c="dimmed">Target Year</Text>
            <b>2056</b>
          </Paper>
        </Group>
      </Paper>

      <Box className={styles.columns}>
        <Paper className={styles.card}>
          <Group justify="space-between">
            <Box>
              <Title order={3}>Goals Connected to This Vision</Title>
              <Text c="dimmed">These goals help make my life vision a reality.</Text>
            </Box>
            <Button component={Link} href="/goals" variant="subtle">
              View all goals
            </Button>
          </Group>
          <Box className={styles.connectedList}>
            {connectedGoals.map(({ title, description, progress, color, iconIndex }) => (
              <Paper className={styles.connectedCard} key={title}>
                <Group wrap="nowrap">
                  <Box className={styles.areaIcon} style={{ backgroundColor: color }}>
                    <GoalCategoryIcon index={iconIndex} />
                  </Box>
                  <b>{title}</b>
                </Group>
                <Group className={styles.progressLine} wrap="nowrap">
                  <Progress value={progress} color="blue" />
                  <b>{progress}%</b>
                </Group>
                <Text c="dimmed">{description}</Text>
              </Paper>
            ))}
          </Box>
        </Paper>
        <Paper className={styles.card}>
          <Title order={3}>Vision Wishlist</Title>
          <Text c="dimmed">Things I want to experience or achieve in my lifetime.</Text>
          <Box className={styles.wishlist}>
            {wishlist.map((item) => (
              <label key={item} className={styles.wishlistItem}>
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item)}
                  onChange={(event) =>
                    setCheckedItems((items) =>
                      event.currentTarget.checked ? [...items, item] : items.filter((checked) => checked !== item)
                    )
                  }
                />
                {item}
              </label>
            ))}
          </Box>
          {adding ? (
            <Box className={styles.draft}>
              <input
                autoFocus
                value={draft}
                placeholder="Add wishlist item"
                onChange={(event) => setDraft(event.target.value)}
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
                <Button onClick={saveWishlistItem}>Add Item</Button>
              </Group>
            </Box>
          ) : (
            <Button variant="subtle" onClick={() => setAdding(true)}>
              Add Wishlist
            </Button>
          )}
        </Paper>
      </Box>

      {dialogOpen && <VisionDialog onClose={() => setDialogOpen(false)} />}
    </CmsPageLayout>
  );
}
