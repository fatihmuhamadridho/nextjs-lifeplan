'use client';

import { useState } from 'react';
import { Avatar, Box, Button, Group, Paper, Text, Title } from '@mantine/core';
import { CmsPageLayout } from '@components/CmsPageLayout';
import styles from './Profile.module.css';

export function ProfileTemplate() {
  const [saved, setSaved] = useState(false);

  return (
    <CmsPageLayout active="Profile">
      <Box className={styles.heading}>
        <Title order={1}>Profile</Title>
        <Text c="dimmed">Manage your personal information and account details.</Text>
      </Box>
      <Paper className={styles.card}>
        <Title order={3}>Profile Information</Title>
        <Text c="dimmed">Update your photo, personal details, and account details.</Text>
        <div className={styles.divider} />
        <Group className={styles.photoRow}>
          <Avatar size={100} color="gray" radius="xl">
            FM
          </Avatar>
          <Button variant="default">Change Photo</Button>
          <Button variant="subtle" color="red">
            Remove
          </Button>
          <Text c="dimmed">JPG, GIF or PNG. 1MB max size recommended.</Text>
        </Group>
        <Box className={styles.formGrid}>
          <label>
            Name
            <input defaultValue="Fatih Muhamad Ridho" />
          </label>
          <label>
            Email
            <input type="email" defaultValue="fatih@example.com" />
          </label>
          <label className={styles.fullWidth}>
            Life Motto / Vision Summary
            <input defaultValue="Living intentionally, maintaining freedom, and building sustainable wealth for family." />
          </label>
        </Box>
        {saved && (
          <Text c="teal" role="status" mt="md">
            Profile changes saved.
          </Text>
        )}
        <div className={styles.divider} />
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            Last updated: Today at 09:41 AM
          </Text>
          <Group>
            <Button variant="default" onClick={() => setSaved(false)}>
              Discard
            </Button>
            <Button onClick={() => setSaved(true)}>Save Changes</Button>
          </Group>
        </Group>
      </Paper>
    </CmsPageLayout>
  );
}
