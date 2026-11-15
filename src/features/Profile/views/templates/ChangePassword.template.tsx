'use client';
import { useState, type FormEvent } from 'react';
import { Alert, Box, Button, Group, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { CmsPageLayout } from '@components/CmsPageLayout';
import styles from './ChangePassword.module.css';

export function ChangePasswordTemplate() {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const currentError = current ? undefined : 'Enter your current password.';
  const passwordError =
    password.length < 8
      ? 'Use at least 8 characters.'
      : password === current
        ? 'Choose a different password from your current password.'
        : undefined;
  const confirmError = !confirm
    ? 'Confirm your new password.'
    : confirm !== password
      ? 'Passwords do not match.'
      : undefined;
  const reset = () => {
    setCurrent('');
    setPassword('');
    setConfirm('');
    setSubmitted(false);
    setUnavailable(false);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!currentError && !passwordError && !confirmError) setUnavailable(true);
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
        <Text c="dimmed">Update the password you use to access your account.</Text>
      </Box>
      <Paper className={styles.panel}>
        <Box component="form" onSubmit={submit} className={styles.form}>
          <Box className={styles.fields}>
            <PasswordInput
              classNames={{
                root: styles.field,
                label: styles.fieldLabel,
                wrapper: styles.inputWrapper,
                description: styles.hint,
                error: styles.hint,
              }}
              inputWrapperOrder={['label', 'input', 'description', 'error']}
              label="Current password"
              placeholder="Enter current password"
              size="md"
              autoComplete="current-password"
              required
              value={current}
              onChange={(event) => {
                setCurrent(event.currentTarget.value);
                setUnavailable(false);
              }}
              error={submitted ? currentError : undefined}
            />
            <PasswordInput
              classNames={{
                root: styles.field,
                label: styles.fieldLabel,
                wrapper: styles.inputWrapper,
                description: styles.hint,
                error: styles.hint,
              }}
              inputWrapperOrder={['label', 'input', 'description', 'error']}
              label="New password"
              placeholder="Create a new password"
              size="md"
              description="Use at least 8 characters."
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.currentTarget.value);
                setUnavailable(false);
              }}
              error={submitted ? passwordError : undefined}
            />
            <PasswordInput
              classNames={{
                root: styles.field,
                label: styles.fieldLabel,
                wrapper: styles.inputWrapper,
                description: styles.hint,
                error: styles.hint,
              }}
              inputWrapperOrder={['label', 'input', 'description', 'error']}
              label="Confirm new password"
              placeholder="Re-enter new password"
              size="md"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(event) => {
                setConfirm(event.currentTarget.value);
                setUnavailable(false);
              }}
              error={submitted ? confirmError : undefined}
            />
            {unavailable && (
              <Alert className={styles.notice} color="orange" title="Password has not been changed" role="status">
                Password changes are not available yet. The account service has not been connected.
              </Alert>
            )}
          </Box>
          <Group justify="flex-end" className={styles.actions}>
            <Button type="button" variant="default" onClick={reset}>
              Cancel
            </Button>
            <Button type="submit">Change Password</Button>
          </Group>
        </Box>
      </Paper>
    </CmsPageLayout>
  );
}
