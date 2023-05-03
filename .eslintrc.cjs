/* eslint-env node */

module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript"],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
    semi: "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/no-multiple-template-root": 0,
  },
};
