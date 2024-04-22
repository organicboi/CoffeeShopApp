module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // ...
    'prettier/prettier': ['error', {singleQuote: true}],
  },
  quotes: [2, 'single'],
};
