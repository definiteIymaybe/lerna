/* eslint-disable */
export default {
  displayName: "e2ee-run",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/e2ee/run",
  maxWorkers: '50%',
  testTimeout: 120000,
  setupFilesAfterEnv: ["<rootDir>/setup.ts"],
};
