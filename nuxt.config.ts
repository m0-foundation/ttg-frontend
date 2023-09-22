import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      walletConnectProjectId: undefined,
      env: {
        node: process.env.NODE_ENV,
        network: process.env.NETWORK,
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
