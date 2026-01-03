import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Food Tracker',
    short_name: 'FoodTracker',
    description: 'Análisis de calorías desde fotos',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/LOGO-FB-WEB.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/LOGO-FB-WEB.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
