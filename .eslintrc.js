module.exports = {
  plugins: ['yml'],
  extends: ['plugin:yml/standard'],
  rules: {
    'max-len': ['error', { code: 120 }],
    'no-trailing-spaces': 'error'
  },
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      parser: 'yaml-eslint-parser'
    }
  ]
};