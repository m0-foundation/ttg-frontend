import { URL, fileURLToPath } from "node:url";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

console.dir(process.env);

const auctionActive = process.env.VITE_APP_IS_AUCTION_ACTIVE === "true";

export default defineNuxtConfig({
  alias: {
    color: "color/index.js",
    "mersenne-twister": "mersenne-twister/src/mersenne-twister.js",
  },
  runtimeConfig: {
    public: {
      walletConnectProjectId: process.env.VITE_APP_WALLET_CONNECT_PROJECT_ID,
      auctionActive,
      env: {
        node: process.env.NODE_ENV,
        build: process.env.BUILD_ENV,
      },
    },
  },
  ssr: false,
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
    "@nuxt/devtools",
    "@vite-pwa/nuxt",
  ],
  ignore: [auctionActive ? "" : "pages/auction.vue"],
  imports: {
    dirs: ["./stores"],
  },

  pwa: {
    manifest: {
      name: "TTG Governance",
      short_name: "TTG",
      theme_color: "#ffffff",
      icons: [
        {
          src: "favicon.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
  },

  vite: {
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./", import.meta.url)),
        // Add any other aliases you use in your code base
        // https://nuxt.com/docs/api/configuration/nuxt-config/#alias
      },
    },
    plugins: [
      AutoImport({
        imports: ["vue", "vue-router"],
        dirs: ["./composables"],
        vueTemplate: true,
      }),
      Components({
        dirs: [
          "./components/**/*",
          // Component folders that should be auto-imported
        ],
        dts: true,
        directoryAsNamespace: true,
      }),
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

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
