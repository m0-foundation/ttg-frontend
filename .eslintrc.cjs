/* eslint-env node */

module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript"],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
    semi: "off",
    "@typescript-eslint/no-unused-vars": "warn",
  },
};
