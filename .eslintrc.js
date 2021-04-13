module.exports = {
  extends: [
    "plugin:@angular-eslint/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // "plugin:@angular-eslint/template/process-inline-templates",
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint', '@angular-eslint', 'prettier'],
  rules: {
    "prettier/prettier": [
      "error",
      {
        "printWidth": 140,
        "singleQuote": true,
        "useTabs": false,
        "tabWidth": 2,
        "semi": true,
        "bracketSpacing": true,
        "endOfLine": "lf"
      },
    ],
  },
};
