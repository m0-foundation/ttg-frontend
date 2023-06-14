/* eslint-env node */

module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
    semi: "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/multi-word-component-names": "off",
    "no-console": "off",
  },
  ignorePatterns: ["node_modules*/", "dist/"],
};
