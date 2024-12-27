import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/*",
      "*.css",
      "esm/*",
      "public/*",
      "tests/*",
      "scripts/*",
      "*.config.js",
      "coverage",
      ".next",
      "build",
      "node_modules",
      "dist",
    ],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off", // Adjust rule to allow require if necessary
      "@typescript-eslint/no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
      "prettier/prettier": ["error"],
    },
  },
];

export default eslintConfig;
