import { defineConfig } from "vitest/config";

export default defineConfig({
    "test": {
        coverage: {
            allowExternal: true,
            exclude:[
                "./vitest.config.ts",
                ".eslintrc.cjs",
                "lib/**",
                "**/base/tests/**"
            ],
            reporter: ['text', 'html', 'lcov']
        },
        testTimeout: 30000
    }
});
