import {defineConfig} from "cypress";
import {setupHardhatEvents} from "./hardhat/index";

export default defineConfig({
  devServer: {
    framework: "nuxt",
    bundler: "vite",
  },
  e2e: {
    experimentalRunAllSpecs: true,
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    async setupNodeEvents(on, config) {
      await setupHardhatEvents(on, config);
      return config;
    },
  },
  defaultCommandTimeout: 20000,
  video: false,
  viewportWidth: 1280,
  viewportHeight: 1024,
  retries: {
    experimentalStrategy: "detect-flake-and-pass-on-threshold",
    experimentalOptions: {
      maxRetries: 2,
      passesRequired: 1,
    },
    runMode: true,
    openMode: true,
  },
});
