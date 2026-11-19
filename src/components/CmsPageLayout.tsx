'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { Alert, Box, Center, Loader } from '@mantine/core';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@components/DashboardNavbar';
import { DashboardSidebar } from '@components/DashboardSidebar';
import { CmsBreadcrumbs, type BreadcrumbItem } from '@components/CmsBreadcrumbs';
import { useGetProfile } from '@core/User/infrastructure/account.hook';
import { LIFEPLAN_ACCESS_TOKEN_KEY } from '@configs/base.config';
import { localStorageService } from '@services/localStorage.service';
import { accountController } from '@core/User/domain/account.controller';
import styles from './CmsPageLayout.module.css';

type CmsPageLayoutProps = {
  active: string;
  children: ReactNode;
  goalCount?: number;
  breadcrumbs?: BreadcrumbItem[];
};

function subscribeToToken(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function CmsPageLayout({ active, children, goalCount = 7, breadcrumbs }: CmsPageLayoutProps) {
  const router = useRouter();
  const hasToken = useSyncExternalStore<boolean | null>(
    subscribeToToken,
    () => Boolean(localStorageService.get(LIFEPLAN_ACCESS_TOKEN_KEY)),
    () => null
  );
  const profileQuery = useGetProfile(hasToken === true);
  const profile = profileQuery.data;
  useEffect(() => {
    if (hasToken === null) return;
    if (!hasToken) {
      router.replace('/login');
      return;
    }
    if (axios.isAxiosError(profileQuery.error) && profileQuery.error.response?.status === 401) {
      accountController.logout();
      router.replace('/login');
    }
  }, [hasToken, profileQuery.error, router]);

  if (hasToken === false || (axios.isAxiosError(profileQuery.error) && profileQuery.error.response?.status === 401))
    return null;
  if (hasToken === null || profileQuery.isLoading)
    return (
      <Center mih="100vh">
        <Loader aria-label="Loading account" />
      </Center>
    );
  if (profileQuery.isError || !profile) {
    return (
      <Center mih="100vh" p="md">
        <Alert color="red" title="Unable to load your account">
          Check your connection and refresh the page.
        </Alert>
      </Center>
    );
  }
  const fullName = profile?.data.name ?? 'Guest User';
  const avatarLabel = fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <Box className={styles.shell}>
      <DashboardSidebar active={active} onNavigate={() => undefined} goalCount={goalCount} />
      <Box className={styles.main}>
        <DashboardNavbar userName={fullName} avatarLabel={avatarLabel || 'GU'} />
        <main className={styles.content}>
          <CmsBreadcrumbs items={breadcrumbs} />
          {children}
        </main>
      </Box>
    </Box>
  );
}
