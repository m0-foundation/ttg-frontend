export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
      ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
      INFURA_API_KEY: process.env.INFURA_API_KEY,
      contracts: {
        deployedBlock: process.env.CONTRACT_DEPLOYED_BLOCK,
        spog: process.env.CONTRACT_ADDRESS_SPOG,
        governor: {
          vote: process.env.CONTRACT_ADDRESS_SPOG_GOVERNOR_VOTE,
          value: process.env.CONTRACT_ADDRESS_SPOG_GOVERNOR_VALUE,
        },
        tokens: {
          cash: process.env.CONTRACT_ADDRESS_CASH,
          vault: process.env.CONTRACT_ADDRESS_VAULT,
          vote: process.env.CONTRACT_ADDRESS_SPOG_VOTE,
          value: process.env.CONTRACT_ADDRESS_SPOG_VALUE,
          // abc,
        },
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
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: "#00CC9B",
            "primary-dark": "#009974",
            "primary-darker": "#00664e",
            "secondary-dark": "#20221F",
            "secondary-light": "#FFFFFF",
            "body-dark": "#0B0B0B",
            red: "#FF3333",
            "grey-primary": "#868886",
            "grey-secondary": "#353835",
          },
        },
      },
    },
  },
});
