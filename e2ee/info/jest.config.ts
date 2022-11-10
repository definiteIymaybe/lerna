/* eslint-disable */
export default {
  displayName: "e2ee-info",
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
  coverageDirectory: "../../coverage/e2ee/info",
  maxWorkers: 1,
  testTimeout: 60000,
};
