import { nodePolyfills } from "vite-plugin-node-polyfills";

import { NetworkConfig, getNetworkConfig } from "./network";

const config: NetworkConfig = getNetworkConfig();

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      env: {
        node: process.env.NODE_ENV,
        network: process.env.NETWORK,
      },
      walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
      chainId: config.chainId,
      rpc: {
        default: config.rpc.default,
        values: config.rpc.values,
      },
      contracts: {
        spog: config.spog,
        multicall3: config.multicall3,
      },
    },
  },
  ssr: false,
  buildModules: ["@nuxtjs/pwa"],
  components: [
    "~/components/design-system",
    "~/components/layout",
    "~/components",
  ],
  // https://tailwindcss.nuxtjs.org/getting-started/setup
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/devtools",
  ],
  imports: {
    dirs: ["./stores"],
  },

  pinia: {
    autoImports: ["defineStore"],
  },
  vite: {
    plugins: [
      nodePolyfills({
        // To exclude specific polyfills, add them to this list.
        exclude: [
          "fs", // Excludes the polyfill for `fs` and `node:fs`.
        ],
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ],
  },

  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
});
