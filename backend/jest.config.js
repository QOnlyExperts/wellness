const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ['**/*.spec.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ['<rootDir>/test'],
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
  clearMocks: true,
};