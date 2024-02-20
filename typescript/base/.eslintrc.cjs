/* eslint-env node */
module.exports = {
    "extends": [
        "eslint:all",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "ignorePatterns": [
        "lib/**",
        "debug.ts"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "root": true,
    "rules": {
        "capitalized-comments": [
            "error",
            "always",
            {
                "ignoreConsecutiveComments": true
            }
        ],
        "multiline-comment-style": [
            "error",
            "separate-lines"
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "one-var": [
            "error",
            "never"
        ],
        "padded-blocks": [
            "error",
            "never"
        ]
    }
};
