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
        "secondary-dark": "#20221F",
        "secondary-light": "#FFFFFF",
        "accent-blue": "#3759BA",
        "accent-mint": "#07F7BD",
        "accent-teal": "#007E89",
        "green-100": "#E6FFF9",
        "green-200": "#CCFFF3",
        "green-300": "#99FFE7",
        "green-400": "#66FFDA",
        "green-500": "#33FFCE",
        "green-600": "#00FFC1",
        "green-700": "#07F7BD",
        "green-800": "#009974",
        "green-900": "#00664E",
        "green-1000": "#003327",
        "grey-100": "#EBEBEB",
        "grey-200": "#DAE2E8",
        "grey-300": "#AEAFAE",
        "grey-400": "#868886",
        "grey-500": "#728DA5",
        "grey-600": "#4B6378",
        "grey-700": "#2D3B48",
        "grey-800": "#171E26",
        "grey-900": "#000D0A",
        "grey-1000": "#0B0B0B",
        "red-100": "#FFE6E6",
        "red-200": "#FFCCCC",
        "red-300": "#FF9999",
        "red-400": "#FF6666",
        "red-500": "#FF3333",
        "red-600": "#EA3323",
        "red-700": "#CC0000",
        "red-800": "#99000",
        "red-900": "#660000",
        "red-1000": "#330000",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace", "PPFormula"],
        ppformula: ["PPFormula", "IBM Plex Mono", "monospace", "sans-serif"],
      },
      fontSize: {
        xxs: ["0.65rem"],
      },
    },
  },
};
