import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ||
  `https://${(process.env.VIRTUAL_HOST || 'bw-icons.ddev.site').split(',')[0]}`;

console.log(`Testing against: ${baseURL}`);

export default defineConfig({
  testDir: 'Tests/Playwright/e2e',
  globalSetup: './Tests/Playwright/global-setup.ts',
  globalTeardown: './Tests/Playwright/global-teardown.ts',
  // Every spec mutates global extension configuration and page TSconfig, so the
  // suite has to stay serial.
  fullyParallel: false,
  workers: 1,
  timeout: 90 * 1000,
  expect: { timeout: 10 * 1000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  outputDir: 'Tests/Playwright/test-results',
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { open: 'never', outputFolder: 'Tests/Playwright/playwright-report' }],
        ['junit', { outputFile: 'Tests/Playwright/test-results/junit.xml' }],
      ]
    : [['list'], ['html', { open: 'never', outputFolder: 'Tests/Playwright/playwright-report' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
