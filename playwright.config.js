const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  timeout: 15000,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8181',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 8000,
  },
  webServer: {
    command: 'python3 -m http.server 8181',
    url: 'http://localhost:8181',
    reuseExistingServer: true,
    timeout: 8000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
