import { reactRouter } from '@react-router/dev/vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild, command }) => ({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },
  ssr: { noExternal: command === 'build' ? true : undefined },
  plugins: [reactRouter(), tsconfigPaths()],
}))
