'use client';

import { Box, Text, Title } from '@mantine/core';
import styles from './DashboardNavbar.module.css';

type DashboardNavbarProps = {
  userName: string;
  avatarSrc?: string;
  avatarLabel: string;
  showGreeting?: boolean;
};

export function DashboardNavbar({ userName, showGreeting = true }: DashboardNavbarProps) {
  const firstName = userName.split(' ')[0] || 'there';
  return (
    <header className={styles.topbar}>
      {showGreeting && (
        <Box>
          <Title order={1}>Good morning, {firstName}!</Title>
          <Text>Stay consistent, small steps create a big future.</Text>
        </Box>
      )}
    </header>
  );
}
