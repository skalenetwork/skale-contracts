/* eslint-env node */
module.exports = {
    extends: [
        'eslint:all',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        "object-curly-spacing": [ "error", "always" ]
    },
    ignorePatterns: [
        "lib/**"
    ]
  };
