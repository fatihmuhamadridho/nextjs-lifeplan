'use client';

import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Group, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { CmsPageLayout } from '@components/CmsPageLayout';
import { useChangePassword } from '@core/User/infrastructure/account.hook';
import styles from './ChangePassword.module.css';

export function ChangePasswordTemplate() {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword.length < 8 || newPassword.length > 256) {
      setError('Your new password must contain 8 to 256 characters.');
      return;
    }
    if (newPassword !== confirmation) {
      setError('The new password and confirmation do not match.');
      return;
    }
    setError('');
    setSaved(false);
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmation('');
          setSaved(true);
        },
        onError: () => setError('Unable to change the password. Check your current password and try again.'),
      }
    );
  };

  return (
    <CmsPageLayout
      active="Profile"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Profile', href: '/profile' },
        { label: 'Change Password' },
      ]}
    >
      <Box className={styles.heading}>
        <Title order={1}>Change Password</Title>
        <Text c="dimmed">Choose a new password for your account.</Text>
      </Box>
      <Paper className={styles.panel}>
        <form className={styles.form} onSubmit={submit}>
          <Box className={styles.fields}>
            <Box className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="current-password">
                Current password
              </label>
              <PasswordInput
                id="current-password"
                className={styles.inputWrapper}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.currentTarget.value)}
                autoComplete="current-password"
                required
              />
            </Box>
            <Box className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="new-password">
                New password
              </label>
              <PasswordInput
                id="new-password"
                className={styles.inputWrapper}
                value={newPassword}
                onChange={(event) => setNewPassword(event.currentTarget.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={256}
                required
              />
              <Text className={styles.hint} c="dimmed">
                Use 8 to 256 characters.
              </Text>
            </Box>
            <Box className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="confirm-password">
                Confirm new password
              </label>
              <PasswordInput
                id="confirm-password"
                className={styles.inputWrapper}
                value={confirmation}
                onChange={(event) => setConfirmation(event.currentTarget.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={256}
                required
              />
            </Box>
          </Box>
          {error && (
            <Alert className={styles.notice} color="red">
              {error}
            </Alert>
          )}
          {saved && (
            <Alert className={styles.notice} color="teal">
              Password changed successfully.
            </Alert>
          )}
          <Group className={styles.actions} justify="flex-end">
            <Button
              type="reset"
              variant="default"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmation('');
                setError('');
                setSaved(false);
              }}
            >
              Clear
            </Button>
            <Button type="submit" loading={changePassword.isPending}>
              Update Password
            </Button>
          </Group>
        </form>
      </Paper>
    </CmsPageLayout>
  );
}
