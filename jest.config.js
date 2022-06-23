"use strict";

/** @type {import('jest').Config} */
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"]
};

module.exports = config;
