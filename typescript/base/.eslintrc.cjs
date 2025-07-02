/* eslint-env node */
module.exports = {
    extends: [
        "eslint:all",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:prettier/recommended",
    ],
    ignorePatterns: ["lib/**", "debug.ts"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
    rules: {
        "capitalized-comments": [
            "error",
            "always",
            {
                ignoreConsecutiveComments: true,
            },
        ],
        "multiline-comment-style": ["error", "separate-lines"],
        "sort-keys": "off",
        "no-warning-comments": ["warn"],
        "object-curly-spacing": ["error", "always"],
        "one-var": ["error", "never"],
        "padded-blocks": ["error", "never"],
        "function-paren-newline": ["error", "multiline-arguments"],
        "no-extra-parens": [
            "error",
            "all",
            {
                nestedBinaryExpressions: false,
            },
        ],
        "indent": ["off"],
        "semi": ["error", "always"],
        "new-cap": ["off"],
        "comma-dangle": ["warn", "always-multiline"],
    },
};
