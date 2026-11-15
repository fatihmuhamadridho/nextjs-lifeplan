'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconCirclePlay,
  IconMenu2,
  IconTarget,
  IconListCheck,
  IconChartBarPopular,
  IconTrophy,
  IconCheck,
  IconHome2,
  IconBulb,
  IconCalendar,
  IconUser,
  IconArrowUpRight,
  IconCircleCheck,
  IconSparkles,
  IconUserCircle,
} from '@tabler/icons-react';
import styles from './Landing.module.css';

const benefits = [
  [
    <IconTarget key="vision" aria-hidden="true" />,
    'Set Your Life Vision',
    'Get clear on what you want in life — your values, big goals and the future you want to build.',
  ],
  [
    <IconListCheck key="plans" aria-hidden="true" />,
    'Break Goals into Plans',
    'Turn your big dreams into smaller, actionable plans and weekly tasks.',
  ],
  [
    <IconChartBarPopular key="progress" aria-hidden="true" />,
    'Track Weekly Progress',
    'Stay consistent with your tasks, stay on track, and see real progress.',
  ],
  [
    <IconTrophy key="success" aria-hidden="true" />,
    'Measure Success Rate',
    'Visualize your progress and see how close you are to living the life you want.',
  ],
] as const;
const steps = [
  [
    <IconTarget key="vision" aria-hidden="true" />,
    'Set your life vision',
    'Clarify what you want in life, from health and career to relationships and freedom.',
  ],
  [
    <IconListCheck key="plans" aria-hidden="true" />,
    'Turn goals into plans',
    'Break your vision into clear goals, smaller milestones and weekly tasks.',
  ],
  [
    <IconChartBarPopular key="action" aria-hidden="true" />,
    'Take action and grow',
    'Track your progress, complete meaningful tasks, and stay consistent every week.',
  ],
] as const;

export function LandingTemplate() {
  const router = useRouter();

  return (
    <Box role="main" className={styles.page}>
      <Box role="banner" className={styles.nav}>
        <Link className={styles.brand} href="#top">
          <Box className={styles.brandMark}>
            <IconTarget size={17} aria-hidden="true" />
          </Box>
          LifePlan
        </Link>
        <Box role="navigation" className={styles.navLinks} aria-label="Main navigation">
          <Link href="#features">Features</Link>
          <Link href="#how">How it works</Link>
          <Link href="#pricing">Pricing</Link>
        </Box>
        <Link className={styles.signIn} href="/login">
          Sign in
        </Link>
        <Link className={styles.menu} href="#features" aria-label="Open navigation">
          <IconMenu2 aria-hidden="true" />
        </Link>
        <Button variant="primary" size="medium" onClick={() => router.push('/register')}>
          <Box className={styles.buttonContent}>
            Get Started Free <IconArrowRight size={14} aria-hidden="true" />
          </Box>
        </Button>
      </Box>
      <Box role="region" aria-label="Introduction" className={styles.hero} id="top">
        <Box className={styles.heroCopy}>
          <Text component="span" className={styles.eyebrow}>
            TURN YOUR DREAMS INTO A PLAN
          </Text>
          <Title order={1}>A clearer tomorrow starts with a plan today.</Title>
          <Text component="p">
            Turn your life vision into clear goals, actionable plans, and weekly progress — all in one place.
          </Text>
          <Box className={styles.actions}>
            <Button variant="primary" size="medium" onClick={() => router.push('/register')}>
              <Box className={styles.buttonContent}>
                Get Started Free <IconArrowRight size={14} aria-hidden="true" />
              </Box>
            </Button>
            <Link href="#how" className={styles.secondary}>
              <IconCirclePlay size={16} aria-hidden="true" /> See How It Works
            </Link>
          </Box>
          <Box className={styles.heroPhoto}>
            <Box className={styles.quote}>
              <IconCheck size={15} aria-hidden="true" /> “A clearer, more intentional me.”
              <Text component="small">LifePlan Member Experience</Text>
            </Box>
          </Box>
          <Box className={styles.proof}>
            <Box className={styles.proofItem}>
              <Box className={styles.proofIcon}>
                <IconTrophy size={12} aria-hidden="true" />
              </Box>
              <Text component="span">
                Join thousands
                <Text component="br" />
                planning a brighter future
              </Text>
            </Box>
            <Box className={styles.proofItem}>
              <Box className={styles.proofIcon}>
                <IconTarget size={12} aria-hidden="true" />
              </Box>
              <Text component="span">
                A more focused,
                <Text component="br" />
                fulfilling life
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box role="region" aria-label="Features" className={styles.features} id="features">
        <Box className={styles.goalGrid}>
          {benefits.map(([icon, title, text]) => (
            <Box key={title} className={styles.goalCard}>
              <Box className={styles.goalIcon}>{icon}</Box>
              <Title order={3}>{title}</Title>
              <Text component="p">{text}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      <Box role="region" aria-label="How it works" className={styles.how} id="how">
        <Text component="span" className={styles.eyebrow}>
          HOW IT WORKS
        </Text>
        <Title order={2}>From vision to weekly progress — in 3 simple steps.</Title>
        <Box className={styles.steps}>
          {steps.map(([icon, title, text], i) => (
            <Box component="article" className={styles.step} key={title}>
              <Box className={styles.goalIcon}>
                {icon}
                <Text component="b">{i + 1}</Text>
              </Box>
              <Box>
                <Title order={3}>{title}</Title>
                <Text component="p">{text}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box role="region" aria-label="Product preview" className={styles.preview}>
        <Box className={styles.previewCopy}>
          <Text component="span" className={styles.eyebrow}>
            PRODUCT PREVIEW
          </Text>
          <Title order={2}>Everything you need to plan a brighter future.</Title>
          <Text component="p">
            A simple, beautiful dashboard to manage your life vision, goals, plans, and weekly progress.
          </Text>
          <Button variant="primary" size="medium" onClick={() => router.push('/register')}>
            <Box className={styles.buttonContent}>
              Get Started Free <IconArrowRight size={14} aria-hidden="true" />
            </Box>
          </Button>
        </Box>
        <Box className={styles.dashboard}>
          <Box className={styles.dashboardSidebar}>
            <Text component="b" fw={700} className={styles.dashboardBrand}>
              <IconTarget size={13} aria-hidden="true" /> LifePlan
            </Text>
            <Box className={styles.dashboardNav}>
              <Text component="span" className={styles.dashboardNavActive}>
                <IconHome2 size={11} aria-hidden="true" /> Home
              </Text>
              <Text component="span">
                <IconBulb size={11} aria-hidden="true" /> My Vision
              </Text>
              <Text component="span">
                <IconTarget size={11} aria-hidden="true" /> Goals
              </Text>
              <Text component="span">
                <IconListCheck size={11} aria-hidden="true" /> Plans
              </Text>
              <Text component="span">
                <IconCalendar size={11} aria-hidden="true" /> Weekly Tasks
              </Text>
              <Text component="span">
                <IconChartBarPopular size={11} aria-hidden="true" /> Progress
              </Text>
            </Box>
            <Text component="span" className={styles.dashboardProfile}>
              <IconUser size={11} aria-hidden="true" /> Profile
            </Text>
          </Box>
          <Box className={styles.dashboardMain}>
            <Box className={styles.dashHead}>
              <Box>
                <Title order={3}>
                  Good morning, Alex <IconSparkles size={12} aria-hidden="true" />
                </Title>
                <Text component="small">Keep going. A better you is a plan away.</Text>
              </Box>
              <Box className={styles.dashboardDate}>
                <IconCalendar size={10} aria-hidden="true" /> Tue, Apr 22, 2025
                <IconUserCircle size={20} aria-hidden="true" />
              </Box>
            </Box>
            <Box className={styles.metrics}>
              <Box className={styles.metricCard}>
                <Text component="span">My Goals</Text>
                <Text component="b">8</Text>
                <Text component="small">total goals</Text>
              </Box>
              <Box className={styles.metricCard}>
                <Text component="span">Weekly Tasks</Text>
                <Text component="b">5/7</Text>
                <Text component="small">completed</Text>
              </Box>
              <Box className={styles.metricCard}>
                <Text component="span">Success Rate</Text>
                <Text component="b">72%</Text>
                <Text component="small">this month</Text>
              </Box>
              <Box className={styles.metricCard}>
                <Text component="span">Current Streak</Text>
                <Text component="b">12</Text>
                <Text component="small">days</Text>
              </Box>
            </Box>
            <Box className={styles.dashBottom}>
              <Box className={styles.dashboardPanel}>
                <Box className={styles.panelHeading}>
                  <Text component="b" fw={700}>
                    My Goals
                  </Text>
                  <Text component="span">
                    View all <IconArrowUpRight size={10} aria-hidden="true" />
                  </Text>
                </Box>
                <Box className={styles.goalProgress}>
                  <Text component="span">
                    <IconCircleCheck size={9} aria-hidden="true" /> Build a healthy, energized life{' '}
                    <Text component="b" fw={700}>
                      80%
                    </Text>
                  </Text>
                  <Box>
                    <Box style={{ width: '80%' }} />
                  </Box>
                </Box>
                <Box className={styles.goalProgress}>
                  <Text component="span">
                    <IconCircleCheck size={9} aria-hidden="true" /> Advance my career{' '}
                    <Text component="b" fw={700}>
                      60%
                    </Text>
                  </Text>
                  <Box>
                    <Box style={{ width: '60%' }} />
                  </Box>
                </Box>
                <Box className={styles.goalProgress}>
                  <Text component="span">
                    <IconCircleCheck size={9} aria-hidden="true" /> Travel the world{' '}
                    <Text component="b" fw={700}>
                      40%
                    </Text>
                  </Text>
                  <Box>
                    <Box style={{ width: '40%' }} />
                  </Box>
                </Box>
                <Box className={styles.goalProgress}>
                  <Text component="span">
                    <IconCircleCheck size={9} aria-hidden="true" /> Build financial freedom{' '}
                    <Text component="b" fw={700}>
                      25%
                    </Text>
                  </Text>
                  <Box>
                    <Box style={{ width: '25%' }} />
                  </Box>
                </Box>
              </Box>
              <Box className={styles.dashboardPanel}>
                <Box className={styles.panelHeading}>
                  <Text component="b" fw={700}>
                    This Week
                  </Text>
                  <Text component="span">+12%</Text>
                </Box>
                <Text component="small">4/7 tasks completed</Text>
                <Box className={styles.chart} aria-label="Weekly progress chart">
                  <Box>
                    <Box style={{ height: '35%' }} />
                    <Text component="span">Mon</Text>
                  </Box>
                  <Box>
                    <Box style={{ height: '55%' }} />
                    <Text component="span">Tue</Text>
                  </Box>
                  <Box>
                    <Box style={{ height: '78%' }} />
                    <Text component="span">Wed</Text>
                  </Box>
                  <Box>
                    <Box style={{ height: '100%' }} />
                    <Text component="span">Thu</Text>
                  </Box>
                  <Box>
                    <Box style={{ height: '72%' }} />
                    <Text component="span">Fri</Text>
                  </Box>
                  <Box>
                    <Box style={{ height: '48%' }} />
                    <Text component="span">Sat</Text>
                  </Box>
                  <Box>
                    <Box style={{ height: '82%' }} />
                    <Text component="span">Sun</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={styles.dashboardNote}>
              <IconSparkles size={10} aria-hidden="true" /> Disciplined today for a brighter tomorrow.
              <IconUserCircle size={16} aria-hidden="true" />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box role="region" aria-label="Pricing and signup" className={styles.closing} id="pricing">
        <Box>
          <Text component="span" className={styles.eyebrow}>
            READY TO BUILD A BRIGHTER TOMORROW?
          </Text>
          <Title order={2}>Turn your life vision into real progress.</Title>
          <Text component="p">
            Get started for free and take the first step towards a more intentional, fulfilling life.
          </Text>
        </Box>
        <Button variant="primary" size="medium" onClick={() => router.push('/register')}>
          <Box className={styles.buttonContent}>
            Get Started Free <IconArrowRight size={14} aria-hidden="true" />
          </Box>
        </Button>
        <Link href="#how" className={styles.secondary}>
          <IconCirclePlay size={14} aria-hidden="true" /> See How It Works
        </Link>
      </Box>
      <Box role="contentinfo" className={styles.footer}>
        <Link className={styles.brand} href="#top">
          <Box className={styles.brandMark}>
            <IconTarget size={14} aria-hidden="true" />
          </Box>
          LifePlan
        </Link>
        <Text component="span">© 2025 LifePlan, Inc. All rights reserved.</Text>
        <Link href="#top">Privacy Policy Terms of Service Contact Support</Link>
      </Box>
      <Box className={styles.mobileCta}>
        <Button variant="primary" size="large" onClick={() => router.push('/register')}>
          <Box className={styles.buttonContent}>
            Get Started Free <IconArrowRight size={14} aria-hidden="true" />
          </Box>
        </Button>
        <Text component="small">Start planning your life with intention.</Text>
      </Box>
    </Box>
  );
}
