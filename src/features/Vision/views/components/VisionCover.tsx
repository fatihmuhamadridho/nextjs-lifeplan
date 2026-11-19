import { Box } from '@mantine/core';
import styles from './VisionCover.module.css';

export const visionCoverStyles = ['Horizon Line', 'Sunrise', 'Minimal Gradient'] as const;

export function VisionCover({ style }: { style: string }) {
  return (
    <Box className={styles.cover} data-style={style} aria-hidden="true">
      <Box className={styles.sun} />
      <Box className={styles.backdrop} />
      <Box className={styles.foreground} />
    </Box>
  );
}
