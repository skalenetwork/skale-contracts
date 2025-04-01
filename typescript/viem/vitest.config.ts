import { defineConfig } from "vitest/config";

export default defineConfig({
    "test": {
        coverage: {
            allowExternal: true,
            exclude:[
                "./vitest.config.ts",
                ".eslintrc.cjs",
                "lib/**"
            ],
            reporter: ['text', 'html', 'lcov']
        },
        setupFiles: ["tests/setup.ts"],
        testTimeout: 30000
    }
});
