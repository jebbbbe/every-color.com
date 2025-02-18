export default {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testEnvironment: "jest-environment-jsdom", // Explicitly specify the environment
  moduleFileExtensions: ["js", "mjs"],
};