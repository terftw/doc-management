module.exports = {
  'packages/*/src/**/*.{js,ts}': ['eslint --fix', 'prettier --write'],
  'packages/*/src/**/*.{jsx,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml}': ['prettier --write'],
  '*.prisma': ['prettier --write'],
};
