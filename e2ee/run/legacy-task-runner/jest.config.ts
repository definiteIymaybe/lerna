/* eslint-disable */
export default {
  displayName: "e2ee-run-legacy-task-runner",
  preset: "../../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/e2ee/run/legacy-task-runner",
  maxWorkers: 1,
  testTimeout: 60000,
};
