import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Load next.config.js and .env files in the test environment.
  dir: "./",
});

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
};

// The icon/animation packages ship as ESM (developer-icons has no CJS build),
// so SWC must transform them instead of leaving raw `import` statements. next/jest
// hard-codes a blanket `/node_modules/` ignore that wins over anything we add via
// the config object, so we await the resolved config and rewrite the patterns:
// drop the blanket ignore and replace it with a negative-lookahead that lets these
// few packages through. See change-animated-icons.md.
const ESM_PACKAGES = [
  "developer-icons",
  "lucide-animated",
  "motion",
  "motion-dom",
  "motion-utils",
];

export default async (): Promise<Config> => {
  const resolved = await createJestConfig(config)();
  return {
    ...resolved,
    transformIgnorePatterns: [
      `/node_modules/(?!(?:${ESM_PACKAGES.join("|")})/)`,
      // Keep next/jest's non-blanket defaults (e.g. CSS modules).
      ...(resolved.transformIgnorePatterns ?? []).filter(
        (p) => p !== "/node_modules/"
      ),
    ],
  };
};
