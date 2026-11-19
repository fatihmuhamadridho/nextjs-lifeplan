'use client';

import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Alert, Anchor, Box, Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconTarget } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLogin, useRegister } from '@core/User/infrastructure/account.hook';
import { accountController } from '@core/User/domain/account.controller';
import { LIFEPLAN_ACCESS_TOKEN_KEY } from '@configs/base.config';
import { localStorageService } from '@services/localStorage.service';
import { CookiesStorageService } from '@services/cookiesStorage.service';
import styles from './AuthForm.module.css';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const login = useLogin();
  const register = useRegister();
  const mutation = mode === 'login' ? login : register;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorageService.get(LIFEPLAN_ACCESS_TOKEN_KEY);
    if (!token) return;
    let cancelled = false;

    accountController
      .getProfile()
      .then(() => {
        if (cancelled || localStorageService.get(LIFEPLAN_ACCESS_TOKEN_KEY) !== token) return;
        new CookiesStorageService().set(LIFEPLAN_ACCESS_TOKEN_KEY, token, {
          sameSite: 'lax',
          secure: window.location.protocol === 'https:',
        });
        router.replace('/dashboard');
      })
      .catch((error: unknown) => {
        if (cancelled || localStorageService.get(LIFEPLAN_ACCESS_TOKEN_KEY) !== token) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) accountController.logout();
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const onSuccess = () => router.replace('/dashboard');
    if (mode === 'login') login.mutate({ email: email.trim(), password }, { onSuccess });
    else register.mutate({ name: name.trim(), email: email.trim(), password }, { onSuccess });
  };

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.story}>
        <Link href="/" className={styles.brand}>
          <Box className={styles.brandMark}>
            <IconTarget size={22} />
          </Box>
          LifePlan
        </Link>
        <Box className={styles.storyContent}>
          <Text className={styles.eyebrow}>MAKE ROOM FOR WHAT MATTERS</Text>
          <Title order={2}>
            A little planning.
            <br />A brighter tomorrow.
          </Title>
          <Text className={styles.storyDescription}>
            Bring your vision, goals, and weekly progress together. Build the life you want, one step at a time.
          </Text>
          <Box className={styles.illustration}>
            <Image
              src="/images/lifeplan-journey.webp"
              alt="A winding path toward a sunlit summit"
              fill
              sizes="(max-width: 900px) 1px, 45vw"
              unoptimized
              loading="eager"
              className={styles.image}
            />
          </Box>
        </Box>
        <Text className={styles.storyFooter}>Your next chapter starts with a plan.</Text>
      </Box>
      <Box className={styles.formSide}>
        <Link href="/" className={styles.back}>
          <IconArrowLeft size={17} />
          Back to home
        </Link>
        <Box className={styles.formContent}>
          <Link href="/" className={styles.mobileBrand}>
            <Box className={styles.brandMark}>
              <IconTarget size={22} />
            </Box>
            LifePlan
          </Link>
          <Paper component="form" onSubmit={submit} className={styles.form}>
            <Stack gap="sm">
              <Box className={styles.heading}>
                <Text className={styles.eyebrow}>{mode === 'login' ? 'YOUR NEXT STEP' : 'START YOUR JOURNEY'}</Text>
                <Title order={1}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Title>
                <Text className={styles.description}>
                  {mode === 'login'
                    ? 'Sign in to continue planning your life.'
                    : 'Start organizing your goals and plans.'}
                </Text>
              </Box>
              {mutation.isError && (
                <Alert color="red" title={mode === 'login' ? 'Unable to sign in' : 'Unable to create account'}>
                  Check your details and try again.
                </Alert>
              )}
              {mode === 'register' && (
                <TextInput
                  size="md"
                  radius="md"
                  label="Full name"
                  placeholder="Your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.currentTarget.value)}
                  required
                />
              )}
              <TextInput
                label="Email"
                placeholder="you@example.com"
                size="md"
                radius="md"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
              />
              <PasswordInput
                label="Password"
                placeholder={mode === 'login' ? 'Enter your password' : 'Choose a password'}
                size="md"
                radius="md"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
              />
              <Button
                type="submit"
                size="md"
                radius="md"
                className={styles.submit}
                loading={mutation.isPending}
                rightSection={<IconArrowRight size={17} />}
              >
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
              <Text ta="center" size="sm" className={styles.switchMode}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Anchor component={Link} href={mode === 'login' ? '/register' : '/login'}>
                  {mode === 'login' ? 'Register' : 'Sign in'}
                </Anchor>
              </Text>
            </Stack>
          </Paper>
        </Box>
        <Text className={styles.formFooter}>A clearer future, one step at a time.</Text>
      </Box>
    </Box>
  );
}
