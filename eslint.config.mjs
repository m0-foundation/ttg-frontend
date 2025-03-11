// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
