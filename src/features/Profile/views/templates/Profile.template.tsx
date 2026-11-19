'use client';

import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Group, Paper, Text, Title } from '@mantine/core';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { useGetProfile, useUpdateProfile } from '@core/User/infrastructure/account.hook';
import styles from './Profile.module.css';

export function ProfileTemplate() {
  const [saved, setSaved] = useState(false);
  const { data: profileResponse, isLoading, isError } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const profile = profileResponse?.data;
  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    updateProfile.mutate(
      {
        name: String(values.get('name') ?? '').trim(),
        email: String(values.get('email') ?? '').trim(),
        motto: String(values.get('motto') ?? '').trim(),
      },
      { onSuccess: () => setSaved(true) }
    );
  };

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
        {isError && (
          <Alert color="red" title="Unable to load profile">
            Refresh the page or try again later.
          </Alert>
        )}
        {updateProfile.isError && (
          <Alert color="red" title="Unable to save profile">
            Check your changes and try again.
          </Alert>
        )}
        <form key={profile?.id ?? 'loading'} onSubmit={saveProfile}>
          <Box className={styles.formGrid}>
            <label>
              Name
              <input name="name" defaultValue={profile?.name ?? ''} required />
            </label>
            <label>
              Email
              <input name="email" type="email" defaultValue={profile?.email ?? ''} required />
            </label>
            <label className={styles.fullWidth}>
              Life Motto / Vision Summary
              <input name="motto" defaultValue={profile?.motto ?? ''} />
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
              {isLoading
                ? 'Loading profile…'
                : profile
                  ? `Last updated: ${new Date(profile.updatedAt).toLocaleString()}`
                  : ''}
            </Text>
            <Group>
              <Button variant="default" type="reset" onClick={() => setSaved(false)}>
                Discard
              </Button>
              <Button type="submit" loading={updateProfile.isPending} disabled={isLoading || !profile}>
                Save Changes
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>
    </CmsPageLayout>
  );
}
