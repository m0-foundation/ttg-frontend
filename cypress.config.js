import { defineConfig } from "cypress";
import cypressFailFast from "cypress-fail-fast/plugin";
import { setupHardhatEvents } from "./hardhat/index";

export default defineConfig({
  devServer: {
    framework: "nuxt",
    bundler: "vite",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    async setupNodeEvents(on, config) {
      await setupHardhatEvents(on, config);
      cypressFailFast(on, config);
      return config;
    },
  },
  defaultCommandTimeout: 120000,
  video: false,
  viewportWidth: 1280,
  viewportHeight: 1024,
});
