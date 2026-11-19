import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'LifePlan | Plan your life with intention',
    short_name: 'LifePlan',
    description: 'Turn your life goals into a clear, thoughtful plan.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2864e8',
    categories: ['productivity'],
    icons: [
      {
        src: '/icons/lifeplan-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/lifeplan-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/lifeplan-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
