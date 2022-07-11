/* eslint-disable @typescript-eslint/naming-convention -- Externally named. */

"use strict";

module.exports = {
    extends: ["@glen-84", "prettier"],
    parserOptions: {
        project: "tsconfig.eslint.json"
    },
    env: {
        es6: true
    },
    rules: {
        // Place to specify ESLint rules.
        "@typescript-eslint/quotes": ["error", "double", {avoidEscape: true}],
        "class-methods-use-this": "off" // Messes up with the resolvers since it cannot be static.
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
                "strict": ["error", "global"]
            },
            parserOptions: {
                sourceType: "script"
            }
        }
    ]
};
