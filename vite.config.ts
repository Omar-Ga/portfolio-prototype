import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'layer-shakira-walker-golden.trycloudflare.com',
      'requires-tropical-lounge-survivor.trycloudflare.com',
      'collectible-beverages-athens-olympus.trycloudflare.com'
    ]
  }
})
