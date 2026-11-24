import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import path from 'path'
import { readFileSync } from 'node:fs'

const dirname = import.meta.dirname

let rootPkg: { version?: string } = {}

try {
  const fileContent = readFileSync(
    path.resolve(dirname, '../packaasge.json'),
    'utf-8'
  )
  rootPkg = JSON.parse(fileContent)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error('Не удалось прочитать или распарсить package.json:', message)
}

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
  define: {
    __APP_VERSION__: JSON.stringify(rootPkg.version ?? '0.0.0'),
  },
})
