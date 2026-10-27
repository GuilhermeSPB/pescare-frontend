import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    watch: {
      // Artefatos de design (Impeccable) são gravados em .impeccable/ durante as sessões;
      // sem isto, cada gravação recarrega a página do painel.
      ignored: ['**/.impeccable/**'],
    },
  },
})
