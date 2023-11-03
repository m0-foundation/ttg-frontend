module.exports = {
  content: [
    "./pages/**/*.{js,ts,vue}",
    "./components/**/*.{js,ts,vue}",
    "./stories/**/*.{js,ts,vue}",
  ],
  plugins: [],
  theme: {
    letterSpacing: {
      widest: "1.0em",
    },
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
        "grey-800": "#202220",
        "grey-600": "#363835",
        "neutral-900": "#151615",
        "grey-900": "#151615",
        "zinc-400": "#AEAFAE",
      },
      fontSize: {
        xxs: ["0.65rem"],
      },
    },
  },
};
