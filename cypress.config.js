import { defineConfig } from "cypress";
import { setupHardhatEvents } from "./hardhat/index";

export default defineConfig({
  devServer: {
    framework: "nuxt",
    bundler: "vite",
  },
  e2e: {
    async setupNodeEvents(on, config) {
      await setupHardhatEvents(on, config);
    },
  },
  defaultCommandTimeout: 120000,
  video: false,
  viewportWidth: 1280,
  viewportHeight: 1024,
});
