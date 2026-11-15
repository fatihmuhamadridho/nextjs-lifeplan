'use client';

import type { ReactNode } from 'react';
import { Box } from '@mantine/core';
import { DashboardNavbar } from '@components/DashboardNavbar';
import { DashboardSidebar } from '@components/DashboardSidebar';
import { CmsBreadcrumbs, type BreadcrumbItem } from '@components/CmsBreadcrumbs';
import { useUserContext } from '@contexts/user.context';
import styles from './CmsPageLayout.module.css';

type CmsPageLayoutProps = {
  active: string;
  children: ReactNode;
  goalCount?: number;
  breadcrumbs?: BreadcrumbItem[];
};

export function CmsPageLayout({ active, children, goalCount = 7, breadcrumbs }: CmsPageLayoutProps) {
  const { state } = useUserContext();
  const fullName = `${state?.data?.firstName ?? ''} ${state?.data?.lastName ?? ''}`.trim() || 'Guest User';
  const avatarLabel = `${state?.data?.firstName?.[0] ?? ''}${state?.data?.lastName?.[0] ?? ''}`.trim() || 'GU';
  return (
    <Box className={styles.shell}>
      <DashboardSidebar active={active} onNavigate={() => undefined} goalCount={goalCount} />
      <Box className={styles.main}>
        <DashboardNavbar userName={fullName} avatarSrc={state?.data?.image} avatarLabel={avatarLabel} />
        <main className={styles.content}>
          <CmsBreadcrumbs items={breadcrumbs} />
          {children}
        </main>
      </Box>
    </Box>
  );
}
