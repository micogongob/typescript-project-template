module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "prettier"
  ],
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  ignorePatterns: ["node_modules", "dist", "public"],
  rules: {
    "prettier/prettier": 2,
    "@typescript-eslint/comma-dangle": 0,
    "no-unused-vars": 1,
    "no-unused-expressions": 1,
    "camelcase": 1,
    "import/no-extraneous-dependencies": 1
  },
  env: {
    node: true,
    es6: true
  },
  parserOptions: {
    project: ["tsconfig.json"]
  }
};
