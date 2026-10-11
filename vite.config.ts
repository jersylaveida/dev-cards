import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/apple-touch-icon.png'],
    manifest: {
      name: 'devcards — Flashcards para devs', short_name: 'devcards',
      description: 'Uma biblioteca de flashcards rápida, privada e offline.',
      theme_color: '#0f0f10', background_color: '#0f0f10', display: 'standalone',
      start_url: '/', orientation: 'portrait-primary', lang: 'pt-BR',
      icons: [
        { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: { navigateFallback: '/index.html', cleanupOutdatedCaches: true, clientsClaim: true }
  })],
})
