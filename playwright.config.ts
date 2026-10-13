import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { environments } from './config/environments';
import { AUTH_FILE } from './config/auth';

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
  // Sequential by default. Run in parallel with: --workers=<N> --fully-parallel
  // (login happens once per run in tests/auth.setup.ts, so workers do not each ask for an OTP)
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 'never' stops the report server from taking over the terminal after every run.
  // Open it with: npm run report
  reporter: [['list'], ['html', { open: 'never' }]],
  // Assertions wait up to 10 s (default 5 s): parallel browsers load the app more slowly
  expect: { timeout: 10_000 },
  // A UI test may take up to 60 s (default 30 s): add + delete flows are slower under parallel load
  timeout: 60_000,
  use: {
    baseURL: environment.baseURL,
    trace: 'on-first-retry',
    // Evidence for failed tests (reports are gitignored; they can show client data)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // A click or fill gives up after 15 s instead of waiting for the whole test timeout.
    actionTimeout: 15_000,
  },

  projects: [
    // Logs in once (manual OTP) and saves the session to AUTH_FILE.
    // Always visible, because a person types the OTP; all other tests can run headless.
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], headless: false },
    },
    // UI tests start with the saved session, so they are already logged in
    {
      name: 'ui',
      testDir: './tests/UI',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
    },
    // API tests use a token, not a browser login
    {
      name: 'api',
      testDir: './tests/API',
    },
  ],
});