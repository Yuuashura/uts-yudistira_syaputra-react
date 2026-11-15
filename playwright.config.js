import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:5180', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: { executablePath: '/nix/store/hqdgw5g4m4hwds79nsikncg9jglq3ajg-chromium-147.0.7727.101/bin/chromium', args: ['--no-sandbox'] },
    },
  }],
  webServer: { command: 'pnpm dev', url: 'http://127.0.0.1:5180', reuseExistingServer: true, timeout: 120000 },
});
