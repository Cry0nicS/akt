/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/naming-convention -- Externally named. */

"use strict";

const baseConfig = require("@glen-84/eslint-config");

module.exports = {
    extends: ["@glen-84", "prettier"],
    parserOptions: {
        project: "tsconfig.eslint.json",
    },
    env: {
        es6: true,
    },
    rules: {
        // Place to specify ESLint rules.
        "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
    },
    // Lint .*.js files in the project root directory.
    ignorePatterns: ["!/.*.js"],
    overrides: [
        {
            // Files that are run with Node.js.
            files: ["./*.js"],
            rules: {
                "@typescript-eslint/no-require-imports": "off",
                "@typescript-eslint/no-var-requires": "off",
                strict: ["error", "global"],
            },
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
};
