import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      exclude: [
      'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.tsx',
     ],
    },
  },
});