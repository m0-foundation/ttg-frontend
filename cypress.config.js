import { defineConfig } from "cypress";
import cypressFailFast from "cypress-fail-fast/plugin";
import { setupHardhatEvents } from "./hardhat/index";

export default defineConfig({
  devServer: {
    framework: "nuxt",
    bundler: "vite",
  },
  e2e: {
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
