export default defineNuxtConfig({
  // https://tailwindcss.nuxtjs.org/getting-started/setup
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    config: {
      theme: {
        colors: {
          primary: "#00CC9B",
          "primary-dark": "#009974",
          "primary-darker": "#F9F9F9",
          "secondary-light": "#FFFFFF",
          "secondary-dark": "#20221F",
          red: "#FF3333",
        },
      },
    },
  },
});
