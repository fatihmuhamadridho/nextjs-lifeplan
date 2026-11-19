'use client';

import { useState } from 'react';
import { Alert, Badge, Box, Button, Group, Paper, Select, Text, Title } from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { CmsPageLayout } from '@components/CmsPageLayout';
import styles from './Reports.module.css';
import { EntityReport } from '../components/EntityReport';
import { useGetOverviewReport, useGetWeeklyReport } from '@core/Report/infrastructure/report.hook';

export function ReportsTemplate() {
  const year = new Date().getFullYear();
  const { data: overviewResponse, isLoading: overviewLoading, isError: overviewError } = useGetOverviewReport();
  const { data: weeklyResponse, isLoading: weeklyLoading, isError: weeklyError } = useGetWeeklyReport(year);
  const [activeTab, setActiveTab] = useState('Success Rate');
  const [period, setPeriod] = useState(`This Year (${year})`);
  const overview = overviewResponse?.data;
  const completed = overview?.tasks.completed ?? 0;
  const failed = overview?.tasks.failed ?? 0;
  const totalTasks = overview?.tasks.total ?? 0;
  const rate = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;
  const now = new Date();
  const periodStart =
    period === `This Year (${year})`
      ? new Date(year, 0, 1)
      : period === 'This Quarter'
        ? new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        : new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const periodEnd = period === `This Year (${year})` ? new Date(year, 11, 31, 23, 59, 59, 999) : now;
  const weeklyTrend = (weeklyResponse?.data ?? [])
    .map((entry) => ({ ...entry, date: new Date(year, entry.month - 1, 1) }))
    .filter(({ date }) => date >= periodStart && date <= periodEnd);
  const hasWeeklyData = weeklyTrend.some((week) => week.successRate !== null);
  const chartData = weeklyTrend.map((week) => ({
    ...week,
    successRate: week.successRate ?? 0,
  }));
  const monthGroups = weeklyTrend.reduce<{ label: string; count: number }[]>((groups, item) => {
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(year, item.month - 1, 1));
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
            onChange={(value) => setPeriod(value ?? `This Year (${year})`)}
            data={[`This Year (${year})`, 'Last 12 Months', 'This Quarter']}
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
          {(overviewError || weeklyError) && (
            <Alert color="red" title="Unable to load reports" mb="md">
              Refresh the page or try again later.
            </Alert>
          )}
          {(overviewLoading || weeklyLoading) && (
            <Text c="dimmed" mb="md">
              Loading report data…
            </Text>
          )}
          <Group className={styles.stats}>
            {[
              ['TASK SUCCESS', `${rate}%`, `${completed} of ${totalTasks} tasks completed`, 'Completed'],
              ['FAILED TASKS', `${failed}`, 'Marked failed or below the success target after the deadline', 'Failed'],
              [
                'ACTIVE TASKS',
                `${overview?.tasks.active ?? 0}`,
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
                <Title order={3}>Weekly Task Success Rate</Title>
                <Text c="dimmed">Completed tasks as a share of all tasks in each week.</Text>
              </Box>
            </Group>
            {!weeklyLoading && !weeklyError && !hasWeeklyData && (
              <Text c="dimmed" mt="md">
                No task data for this period. Assign tasks to a scheduled week or set a due date.
              </Text>
            )}
            <Box
              className={styles.chartScroll}
              tabIndex={0}
              role="region"
              aria-label="Weekly task success rate chart, scroll horizontally to see all months"
            >
              <Box style={{ minWidth: Math.max(weeklyTrend.length * 16, 280) }}>
                <AreaChart
                  className={styles.chart}
                  h="clamp(260px, 45vh, 360px)"
                  data={chartData}
                  dataKey="week"
                  series={[{ name: 'successRate', label: 'Success Rate', color: 'teal.6' }]}
                  tooltipProps={{
                    content: ({ active, label }) => {
                      const week = chartData.find((entry) => entry.week === label);
                      if (!active || !week) return null;
                      return (
                        <Paper withBorder shadow="md" radius="md" p="md" miw={200}>
                          <Text fw={600} mb="xs">
                            {week.week}
                            <Text component="span" display="block" size="xs" c="dimmed" fw={400}>
                              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(week.date)}
                            </Text>
                            {week.start && week.end && (
                              <Text component="span" display="block" size="xs" c="dimmed" fw={400}>
                                {new Intl.DateTimeFormat('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  timeZone: 'UTC',
                                }).formatRange(new Date(week.start), new Date(week.end))}
                              </Text>
                            )}
                          </Text>
                          <Group justify="space-between" gap="lg">
                            <Text c="teal">Success Rate</Text>
                            <Text fw={600}>{week.successRate.toFixed(0)}%</Text>
                          </Group>
                          <Group justify="space-between" gap="lg" mt={4}>
                            <Text>Successful tasks</Text>
                            <Text fw={600}>{week.successCount}</Text>
                          </Group>
                          <Group justify="space-between" gap="lg" mt={4}>
                            <Text>Failed tasks</Text>
                            <Text fw={600}>{week.failedCount}</Text>
                          </Group>
                        </Paper>
                      );
                    },
                  }}
                  curveType="monotone"
                  connectNulls={false}
                  withDots
                  dotProps={{ r: 4 }}
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
