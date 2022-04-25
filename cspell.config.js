// @ts-check

"use strict";

module.exports = /** @type {import("@cspell/cspell-types").FileSettings} */ ({
    version: "0.2",
    language: "en-GB",
    files: ["/*.{js,json,md}", "/.*.js"],
    ignorePaths: ["package-lock.json"],
    ignoreWords: ["commitlint", "esports", "gamer", "gaming", "popescu"],
    cache: {
        useCache: true,
        cacheLocation: "node_modules/.cache/cspell",
    },
});
