module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json"
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "max-len": ["warn", {"code": 150}],
    "no-unused-vars": "error",
    "no-restricted-syntax": ["error", {
      selector: "ExportDefaultDeclaration",
      message: "Prefer named exports."
    }],
    "@typescript-eslint/ban-ts-comment": ["error", {"ts-ignore": "allow-with-description"}],
    "@typescript-eslint/no-unused-vars": "off", // Already covered by no-unused-vars
    "@typescript-eslint/no-misused-promises": "off"
  },
  ignorePatterns: ["drizzle"]
}
