'use client';

import { Avatar, Box, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight, IconLogout, IconUser, IconLock } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '@contexts/user.context';
import styles from './SidebarAccount.module.css';
import { useState } from 'react';

export function SidebarAccount() {
  const [opened, setOpened] = useState(false);
  const { state, setState } = useUserContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const name = `${state?.data?.firstName ?? ''} ${state?.data?.lastName ?? ''}`.trim() || 'Guest User';
  const initials = `${state?.data?.firstName?.[0] ?? ''}${state?.data?.lastName?.[0] ?? ''}` || 'GU';
  const logout = async () => {
    await queryClient.cancelQueries();
    setState(undefined);
    queryClient.clear();
    window.location.replace('/');
  };
  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      position="top-start"
      width={240}
      shadow="lg"
      radius="lg"
      withinPortal
      offset={8}
      classNames={{ dropdown: styles.dropdown, item: styles.item, itemSection: styles.itemIcon }}
    >
      <Menu.Target>
        <UnstyledButton
          className={`${styles.trigger} ${opened ? styles.triggerOpened : ''}`}
          aria-label="Open account menu"
        >
          <Avatar src={state?.data?.image} color="blue" radius="xl" styles={{ placeholder: { fontSize: 12 } }}>
            {initials}
          </Avatar>
          <Text className={styles.name} size="12px" fw={600}>
            {name}
          </Text>
          <IconChevronRight size={16} className={opened ? styles.chevronOpened : ''} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown p={6}>
        <Group className={styles.accountHeader} gap="sm" wrap="nowrap">
          <Avatar src={state?.data?.image} color="blue" radius="xl" styles={{ placeholder: { fontSize: 12 } }}>
            {initials}
          </Avatar>
          <Box style={{ minWidth: 0 }}>
            <Text size="12px" fw={600} truncate>
              {name}
            </Text>
            <Text size="11px" c="dimmed">
              Your account
            </Text>
          </Box>
        </Group>
        <Menu.Divider />
        <Menu.Item leftSection={<IconUser size={18} />} onClick={() => router.push('/profile')}>
          Profile
        </Menu.Item>
        <Menu.Item leftSection={<IconLock size={18} />} onClick={() => router.push('/change-password')}>
          Change Password
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconLogout size={18} />} onClick={logout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
