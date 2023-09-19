import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
      walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
      network: {
        defaultRpc: process.env.NETWORK_DEFAULT_RPC,
        rpcs: process.env.NETWORK_RPC_LIST,
        chainId: process.env.NETWORK_CHAIN_ID,
      },
      contracts: {
        deployedBlock: process.env.CONTRACT_DEPLOYED_BLOCK,
        spog: process.env.CONTRACT_ADDRESS_SPOG,
        multicall3: process.env.CONTRACT_ADDRESS_MULTICALL3,
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
});
