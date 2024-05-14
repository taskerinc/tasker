import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  timeout: 60_000,
  outputDir: 'test-results',
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.CI ? 'http://localhost:3000' : 'http://[::1]:3000',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    timeout: 120_000,
    command: process.env.CI
      ? 'pnpm exec nx run @tasker/web:next:start'
      : 'pnpm exec nx run @tasker/web:next:start -H ::',
    url: process.env.CI ? 'http://localhost:3000' : 'http://[::1]:3000',
    reuseExistingServer: !!process.env.CI,
  },
});
