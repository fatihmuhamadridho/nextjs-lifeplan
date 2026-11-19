'use client';

import { useTasks } from '@features/Task/views/data/taskStore';
import { taskStatus } from '@features/Task/views/data/tasks';
import { useState } from 'react';
import { ActionIcon, Badge, Box, Drawer, Text, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
  IconMenu2,
  IconCalendarEvent,
  IconChartBar,
  IconCompass,
  IconHome2,
  IconListCheck,
  IconTarget,
} from '@tabler/icons-react';
import styles from './DashboardSidebar.module.css';
import { SidebarAccount } from './SidebarAccount';
import { useGetProfile } from '@core/User/infrastructure/account.hook';

const navGroups = [
  {
    label: 'OVERVIEW',
    links: [
      ['Dashboard', IconHome2],
      ['Vision', IconCompass],
      ['Goals', IconTarget],
    ],
  },
  {
    label: 'CADENCE & EXECUTION',
    links: [
      ['Plans', IconCalendarEvent],
      ['Tasks', IconListCheck],
    ],
  },
  {
    label: 'REVIEW',
    links: [['Reports', IconChartBar]],
  },
] as const;

export function DashboardSidebar({
  active,
  onNavigate,
  goalCount = 5,
}: {
  active: string;
  onNavigate: (item: string) => void;
  goalCount?: number;
}) {
  const [tasks] = useTasks();
  const activeTaskCount = tasks.filter((task) => ['To Do', 'In Progress'].includes(taskStatus(task))).length;
  const router = useRouter();
  const { data: profile } = useGetProfile();
  const firstName = profile?.data.name.split(/\s+/)[0] || 'Guest';
  const [opened, setOpened] = useState(false);
  const routes: Record<string, string> = {
    Dashboard: '/dashboard',
    Vision: '/vision',
    Goals: '/goals',
    Plans: '/plans',
    Tasks: '/tasks',
    Reports: '/reports',
  };
  const navigation = (
    <nav className={styles.navigation}>
      {navGroups.map((group) => (
        <Box key={group.label}>
          <Text className={styles.navLabel}>{group.label}</Text>
          {group.links.map(([label, Icon]) => (
            <UnstyledButton
              key={label}
              className={`${styles.navItem} ${active === label ? styles.active : ''}`}
              onClick={() => {
                setOpened(false);
                onNavigate(label);
                router.push(routes[label] ?? '/dashboard');
              }}
            >
              <Icon size={17} />
              <span className={styles.navText}>{label}</span>
              {label === 'Goals' ? (
                <Badge className={styles.navBadge}>{goalCount}</Badge>
              ) : label === 'Tasks' ? (
                <Badge className={styles.navBadge}>{activeTaskCount} active</Badge>
              ) : null}
              {active === label ? <i /> : null}
            </UnstyledButton>
          ))}
        </Box>
      ))}
    </nav>
  );
  return (
    <>
      <aside className={styles.sidebar}>
        <Box className={styles.logo}>
          <span>
            <IconCompass size={19} />
          </span>
          <b>LifePlan</b>
          <Box className={styles.mobileGreeting}>
            <Text fw={700}>Good morning, {firstName}!</Text>
            <Text size="xs" c="dimmed">
              Stay consistent, small steps create a big future.
            </Text>
          </Box>
          <ActionIcon
            variant="subtle"
            className={styles.mobileToggle}
            aria-label="Open navigation"
            aria-expanded={opened}
            onClick={() => setOpened((value) => !value)}
          >
            <IconMenu2 size={22} />
          </ActionIcon>
        </Box>
        <Box className={styles.desktopNavigation}>{navigation}</Box>
        <Box className={styles.sideBottom}>
          <SidebarAccount />
        </Box>
      </aside>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Box className={styles.drawerBrand}>
            <span>
              <IconCompass size={21} />
            </span>
            <b>LifePlan</b>
          </Box>
        }
        position="left"
        size="min(320px, 88vw)"
        padding={0}
        zIndex={200}
        classNames={{
          content: styles.drawerContent,
          header: styles.drawerHeader,
          body: styles.drawerBody,
          close: styles.drawerClose,
        }}
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
      >
        <Box className={styles.drawerNavigation}>{navigation}</Box>
        <Box className={styles.drawerAccount}>
          <SidebarAccount />
        </Box>
      </Drawer>
    </>
  );
}
