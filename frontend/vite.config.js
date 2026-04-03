import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://www.anuveshanatechnologies.in',
      dynamicRoutes: [
        '/',
        '/portfolio',
        '/blog',
        '/about',
        '/contact',
        '/visualize/dual-name-plank',
        '/visualize/initial-name-stand',
        '/visualize/keychain'
      ]
    })
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
