// @ts-check

"use strict";

module.exports = /** @type {import("@cspell/cspell-types").FileSettings} */ ({
    version: "0.2",
    language: "en-GB",
    files: ["**/*.{ts,js,json,md}", "/.*.{ts,js}"],
    ignorePaths: ["package-lock.json"],
    cache: {
        useCache: true,
        cacheLocation: "node_modules/.cache/cspell"
    },
    dictionaries: ["custom"],
    dictionaryDefinitions: [
        {
            name: "custom",
            path: "custom.dic",
            addWords: true
        }
    ]
});
