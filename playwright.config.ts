import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { environments } from './config/environments';

// Credentials come from a local .env file (see .env.example), never from source code.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

const environmentName = process.env.TEST_ENV ?? 'qa';
if (!(environmentName in environments)) {
  throw new Error(
    `Unknown TEST_ENV "${environmentName}". Valid values: ${Object.keys(environments).join(', ')}`,
  );
}
// These tests create and delete data, so running them against prod needs an explicit opt-in.
if (environmentName === 'prod' && process.env.ALLOW_PROD !== 'true') {
  throw new Error('Refusing to run against prod. Set ALLOW_PROD=true if this is really intended.');
}
const environment = environments[environmentName as keyof typeof environments];

export default defineConfig({
  testDir: './tests',
  // Logging in needs a person to enter an SMS OTP, so tests run one at a time.
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 'never' stops the report server from taking over the terminal after every run.
  // Open it with: npm run report
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: environment.baseURL,
    trace: 'on-first-retry',
    // A click or fill gives up after 15 s instead of waiting for the whole test timeout.
    actionTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox and WebKit are switched off: every browser would ask for its own SMS OTP.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});