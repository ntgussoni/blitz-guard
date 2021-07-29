module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["tsx", "ts", "js", "json"],
  coverageReporters: ["json", "lcov", "text", "clover"],
  // collectCoverage: !!`Boolean(process.env.CI)`,
  modulePathIgnorePatterns: ["<rootDir>/tmp", "<rootDir>/lib"],
  testTimeout: 30000,
  coverageDirectory: ".coverage",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!*.config.{js,ts}",
    "!**/templates/**",
    "!**/node_modules/**",
  ],

  globals: {
    "ts-jest": {
      tsConfig: "test/tsconfig.json",
      isolatedModules: true,
    },
  },
}
