module.exports = {
  plugins: ['import'],
  extends: [
    'eslint-config-airbnb-base',
  ],
  settings: {
    'import/resolver': 'webpack',
  },
  rules: {
    'spaced-comment': 'off',
    'no-plusplus': 'off',
    'semi-style': 'off',
    'semi': 'off',
  },
  globals: {
    'window': true,
    'document': true,
    '$': true,
    'jQuery': true,
    'moment': true,
    'Morris': true,
  },
}
