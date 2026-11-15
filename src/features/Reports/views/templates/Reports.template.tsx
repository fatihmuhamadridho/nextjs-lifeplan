'use client';

import { useTasks } from '@features/Task/views/data/taskStore';
import { taskStatus } from '@features/Task/views/data/tasks';
import { useState } from 'react';
import { Badge, Box, Button, Group, Paper, Select, Text, Title } from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { CmsPageLayout } from '@components/CmsPageLayout';
import styles from './Reports.module.css';
import { EntityReport } from '../components/EntityReport';

function getWeeksInYear(year: number) {
  const firstThursday = new Date(year, 0, 4);
  const firstMonday = new Date(firstThursday);
  firstMonday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7));

  const weeks: { date: Date; month: number; label: string }[] = [];
  let weekNumber = 1;
  for (const start = new Date(firstMonday); ; start.setDate(start.getDate() + 7)) {
    const thursday = new Date(start);
    thursday.setDate(start.getDate() + 3);
    if (thursday.getFullYear() > year) break;
    if (thursday.getFullYear() === year) {
      weeks.push({ date: thursday, month: thursday.getMonth(), label: `Week ${weekNumber}` });
    }
    weekNumber += 1;
  }

  return weeks;
}

export function ReportsTemplate() {
  const [tasks] = useTasks();
  const [activeTab, setActiveTab] = useState('Success Rate');
  const [period, setPeriod] = useState('This Year (2026)');
  const completed = tasks.filter((task) => taskStatus(task) === 'Completed').length;
  const failed = tasks.filter((task) => taskStatus(task) === 'Failed').length;
  const rate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const now = new Date();
  const periodStart =
    period === 'This Year (2026)'
      ? new Date(2026, 0, 1)
      : period === 'This Quarter'
        ? new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        : new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const periodEnd = period === 'This Year (2026)' ? new Date(2026, 11, 31, 23, 59, 59, 999) : now;
  const weeklyTrend = getWeeksInYear(2026)
    .filter(({ date }) => date >= periodStart && date <= periodEnd)
    .map(({ month, label }) => {
      const week = label;
      const weeklyTasks = tasks.filter((task) => task.week === week);
      const successCount = weeklyTasks.filter((task) => taskStatus(task) === 'Completed').length;
      const failedCount = weeklyTasks.filter((task) => taskStatus(task) === 'Failed').length;
      const total = weeklyTasks.length;
      return {
        week,
        month,
        successRate: total ? (successCount / total) * 100 : null,
        failedRate: total ? (failedCount / total) * 100 : null,
      };
    });
  const firstWeekWithData = weeklyTrend.findIndex((week) => week.successRate !== null || week.failedRate !== null);
  const chartData = weeklyTrend.map((week, index) =>
    index < firstWeekWithData ? { ...week, successRate: 0, failedRate: 0 } : week
  );
  const monthGroups = weeklyTrend.reduce<{ label: string; count: number }[]>((groups, item) => {
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2026, item.month, 1));
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.label === label) lastGroup.count += 1;
    else groups.push({ label, count: 1 });
    return groups;
  }, []);

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
                <Title order={3}>Weekly Task Rates</Title>
                <Text c="dimmed">Success and failed tasks as a share of all tasks in each week.</Text>
              </Box>
            </Group>
            <Box
              className={styles.chartScroll}
              tabIndex={0}
              role="region"
              aria-label="Weekly task rates chart, scroll horizontally to see all months"
            >
              <Box style={{ minWidth: Math.max(weeklyTrend.length * 16, 280) }}>
                <AreaChart
                  className={styles.chart}
                  h="clamp(260px, 45vh, 360px)"
                  data={chartData}
                  dataKey="week"
                  series={[
                    { name: 'successRate', label: 'Success Rate', color: 'teal.6' },
                    { name: 'failedRate', label: 'Failed Rate', color: 'red.6' },
                  ]}
                  curveType="monotone"
                  connectNulls={false}
                  fillOpacity={0.18}
                  gridAxis="x"
                  tickLine="none"
                  strokeWidth={3}
                  withLegend
                  styles={{ legend: { justifyContent: 'flex-start' } }}
                  yAxisProps={{ domain: [0, 100], ticks: [0, 25, 50, 75, 100], tickFormatter: (value) => `${value}%` }}
                  valueFormatter={(value) => `${value.toFixed(0)}%`}
                  xAxisProps={{
                    interval: 'preserveStartEnd',
                    minTickGap: 20,
                    tickMargin: 8,
                    tickFormatter: (value) => String(value).replace('Week ', 'W'),
                  }}
                />
                <Box
                  className={styles.monthLabels}
                  style={{ gridTemplateColumns: `repeat(${Math.max(weeklyTrend.length, 1)}, minmax(0, 1fr))` }}
                >
                  {monthGroups.map((group) => (
                    <Text key={group.label} style={{ gridColumn: `span ${group.count}` }}>
                      {group.label}
                    </Text>
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </CmsPageLayout>
  );
}
