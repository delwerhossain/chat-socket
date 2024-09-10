import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginNode from "eslint-plugin-node"; // Importing ESLint plugin for Node.js

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
    plugins: {
      node: eslintPluginNode,
    },
    rules: {
      // Custom rules for Express.js
      "node/no-unpublished-import": ["error", {
        allowModules: ["express"],
      }],
      "node/no-unsupported-features/es-syntax": [
        "error",
        { "ignores": ["modules"] }
      ],
      "no-console": "warn", // Example rule to warn about console logs
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Ignore unused variables with a leading underscore
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
