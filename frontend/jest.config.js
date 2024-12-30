module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)", // Transpile axios
  ],
  moduleFileExtensions: ["js", "jsx"]
};
