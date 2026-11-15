'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Anchor, Breadcrumbs, Text } from '@mantine/core';

export type BreadcrumbItem = { label: string; href?: string };

export function CmsBreadcrumbs({ items }: { items?: BreadcrumbItem[] }) {
  const pathname = usePathname();
  const sections: Record<string, string> = {
    dashboard: 'Dashboard',
    goals: 'Goals',
    plans: 'Plans',
    tasks: 'Tasks',
    vision: 'Vision',
    reports: 'Reports',
    profile: 'Profile',
    'change-password': 'Change Password',
  };
  const segment = pathname.split('/')[1];
  const section = sections[segment];
  if (!section) return null;
  if (items) {
    return (
      <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
        <Breadcrumbs separator="/">
          {items.map((item, index) =>
            item.href && index < items.length - 1 ? (
              <Anchor component={Link} href={item.href} size="sm" key={`${index}-${item.label}`}>
                {item.label}
              </Anchor>
            ) : (
              <Text
                size="sm"
                c="dimmed"
                aria-current={index === items.length - 1 ? 'page' : undefined}
                key={`${index}-${item.label}`}
              >
                {item.label}
              </Text>
            )
          )}
        </Breadcrumbs>
      </nav>
    );
  }
  const href = `/${segment}`;
  const isDetail = pathname.endsWith('/detail');
  const detailTitle = section === 'Goals' ? 'Build Passive Income' : 'Build E-Commerce Business';

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
      <Breadcrumbs separator="/">
        {segment !== 'dashboard' && (
          <Anchor component={Link} href="/dashboard" size="sm">
            Dashboard
          </Anchor>
        )}
        {isDetail ? (
          <Anchor component={Link} href={href} size="sm">
            {section}
          </Anchor>
        ) : (
          <Text size="sm" c="dimmed" aria-current="page">
            {section}
          </Text>
        )}
        {isDetail && (
          <Text size="sm" c="dimmed" aria-current="page">
            {detailTitle}
          </Text>
        )}
      </Breadcrumbs>
    </nav>
  );
}
