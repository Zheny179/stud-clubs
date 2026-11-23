import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import path from 'path'

const dirname = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@components': path.resolve(dirname, './src/components'),
    },
  },

  css: {
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:4]',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${path
          .resolve(dirname, './src/styles/helpers')
          .replace(/\\/g, '/')}" as *;`,
      },
    },
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr()],
})
