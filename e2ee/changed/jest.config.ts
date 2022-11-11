/* eslint-disable */
export default {
  displayName: "e2ee-changed",
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
  coverageDirectory: "../../coverage/e2ee/changed",
  maxWorkers: 1,
  testTimeout: 60000,
};
