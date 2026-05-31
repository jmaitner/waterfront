import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite + React + Tailwind v4. `npm run dev` to start, `npm run build` -> dist/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
