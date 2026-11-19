import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import styles from './layout.module.css';
import type { Metadata, Viewport } from 'next';
import { AppProviders } from '@contexts/appProviders.context';
import { ServiceWorkerRegistration } from '@components/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'LifePlan | Plan your life with intention',
  description: 'Turn your life goals into a clear, thoughtful plan.',
  appleWebApp: {
    capable: true,
    title: 'LifePlan',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icons/lifeplan-192.png',
    apple: '/icons/lifeplan-180.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#2864e8',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={styles.html} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={styles.body}>
        <MantineProvider>
          <AppProviders>
            {children}
            <ServiceWorkerRegistration />
          </AppProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
