import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
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