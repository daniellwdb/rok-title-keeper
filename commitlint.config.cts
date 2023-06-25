import type { UserConfig } from "@commitlint/types";

const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [2, "always", "lower-case"],
    "header-max-length": [2, "always", 120],
  },
} satisfies UserConfig;

module.exports = config;
