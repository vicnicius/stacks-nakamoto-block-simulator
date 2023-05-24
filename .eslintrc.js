module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "@typescript-eslint", "import"],
  rules: {
    "no-console": "error",
    // Necessary to work with react-three-fiber. See: https://github.com/jsx-eslint/eslint-plugin-react/issues/3423
    "react/no-unknown-property": "off",
    "import/order": ["error", { alphabetize: { order: "asc" } }],
  },
};
