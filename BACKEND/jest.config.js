export default {
    transform: {
      "^.+\\.mjs$": "babel-jest"
    },
    testEnvironment: "node",
    testMatch: ["<rootDir>/tests/**/*.test.mjs"]
  };
  