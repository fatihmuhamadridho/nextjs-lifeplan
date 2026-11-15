import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import styles from './layout.module.css';
import type { Metadata } from 'next';
import { AppProviders } from '@contexts/appProviders.context';

export const metadata: Metadata = {
  title: 'LifePlan | Plan your life with intention',
  description: 'Turn your life goals into a clear, thoughtful plan.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={styles.html} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={styles.body}>
        <MantineProvider>
          <AppProviders>{children}</AppProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
