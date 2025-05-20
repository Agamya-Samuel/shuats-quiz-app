import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier integration (run Prettier as an ESLint rule)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Optional: ensure files are linted with Prettier formatting
  ...compat.extends('plugin:prettier/recommended'),
];

export default eslintConfig;
