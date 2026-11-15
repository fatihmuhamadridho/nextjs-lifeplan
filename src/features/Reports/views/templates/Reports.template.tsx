'use client';

import { useTasks } from '@features/Task/views/data/taskStore';
import { taskStatus } from '@features/Task/views/data/tasks';
import { useState } from 'react';
import { Badge, Box, Button, Group, Paper, Select, Text, Title } from '@mantine/core';
import { CmsPageLayout } from '@components/CmsPageLayout';
import styles from './Reports.module.css';
import { EntityReport } from '../components/EntityReport';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ReportsTemplate() {
  const [tasks] = useTasks();
  const completed = tasks.filter((task) => taskStatus(task) === 'Completed').length;
  const failed = tasks.filter((task) => taskStatus(task) === 'Failed').length;
  const rate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const trend = months.map((_, month) => {
    const items = tasks.filter(
      (task) =>
        task.due &&
        new Date(`${task.due}T00:00:00`).getFullYear() === 2026 &&
        new Date(`${task.due}T00:00:00`).getMonth() === month
    );
    return items.length
      ? Math.round((items.filter((task) => taskStatus(task) === 'Completed').length / items.length) * 100)
      : 0;
  });
  const [activeTab, setActiveTab] = useState('Success Rate');
  const [period, setPeriod] = useState('This Year (2026)');

  return (
    <CmsPageLayout active="Reports">
      <Group justify="space-between" className={styles.tabsRow}>
        <Group className={styles.tabs}>
          {['Success Rate', 'Goals', 'Plans', 'Tasks'].map((tab) => (
            <Button
              key={tab}
              variant="subtle"
              className={activeTab === tab ? styles.activeTab : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </Group>
        {activeTab === 'Success Rate' && (
          <Select
            className={styles.periodSelect}
            value={period}
            onChange={(value) => setPeriod(value ?? 'This Year (2026)')}
            data={['This Year (2026)', 'Last 12 Months', 'This Quarter']}
            aria-label="Report period"
            allowDeselect={false}
            size="sm"
            radius="md"
            comboboxProps={{ shadow: 'md' }}
          />
        )}
      </Group>

      {activeTab !== 'Success Rate' ? (
        <EntityReport category={activeTab} />
      ) : (
        <>
          <Group className={styles.stats}>
            {[
              [
                'TASK SUCCESS',
                `${rate}%`,
                `${completed} of ${tasks.length} tasks reached their success target`,
                'Completed',
              ],
              ['FAILED TASKS', `${failed}`, 'Below the success target after the due date', 'Failed'],
              [
                'ACTIVE TASKS',
                `${tasks.length - completed - failed}`,
                'To do and in progress before their deadline',
                'Active',
              ],
            ].map(([label, value, caption, trendLabel]) => (
              <Paper className={styles.card} key={label}>
                <Group justify="space-between">
                  <Text c="dimmed">{label}</Text>
                  <Badge
                    color={trendLabel === 'Failed' ? 'red' : trendLabel === 'Active' ? 'blue' : 'teal'}
                    variant="light"
                  >
                    {trendLabel}
                  </Badge>
                </Group>
                <Title order={2}>{value}</Title>
                <Text c="dimmed">{caption}</Text>
              </Paper>
            ))}
          </Group>

          <Paper className={styles.card} mt="lg">
            <Group justify="space-between" align="flex-start">
              <Box>
                <Title order={3}>Success Rate Trend</Title>
                <Text c="dimmed">
                  Task success rate grouped by due month for {period.includes('2026') ? '2026' : 'the selected period'}
                </Text>
              </Box>
              <Group className={styles.legend}>
                <Text>
                  <i />
                  Success Rate (%)
                </Text>
                <Text>
                  <i />
                  Target Benchmark (75%)
                </Text>
              </Group>
            </Group>
            <Box className={styles.chart}>
              <svg viewBox="0 0 1040 320" preserveAspectRatio="none" role="img" aria-label="Monthly success rate trend">
                <defs>
                  <linearGradient id="successArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2864e8" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#2864e8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 25, 50, 75, 100].map((value) => {
                  const y = 280 - value * 2.35;
                  return (
                    <g key={value}>
                      <line
                        x1="56"
                        x2="1030"
                        y1={y}
                        y2={y}
                        className={value === 75 ? styles.benchmark : styles.gridLine}
                      />
                      <text x="4" y={y + 4}>
                        {value}%
                      </text>
                    </g>
                  );
                })}
                <polygon
                  points={`56,280 ${trend.map((value, index) => `${56 + index * 88},${280 - value * 2.35}`).join(' ')} 1024,280`}
                  fill="url(#successArea)"
                />
                <polyline
                  points={trend.map((value, index) => `${56 + index * 88},${280 - value * 2.35}`).join(' ')}
                  className={styles.line}
                />
                {trend.map((value, index) => (
                  <circle
                    key={months[index]}
                    cx={56 + index * 88}
                    cy={280 - value * 2.35}
                    r={index === 8 ? 6 : 4}
                    className={styles.point}
                  />
                ))}
              </svg>
              <Box className={styles.months}>
                {months.map((month) => (
                  <Text key={month}>{month}</Text>
                ))}
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </CmsPageLayout>
  );
}
