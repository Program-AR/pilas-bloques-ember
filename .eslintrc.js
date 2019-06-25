module.exports = {
  root: true,
  plugins: [
    'ember',
    'eslint-plugin-ember',
    'eslint-plugin-standard'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: false,
    node: true
  },
  rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
    // add your custom rules and overrides for node files here

    // this can be removed once the following is fixed
    // https://github.com/mysticatea/eslint-plugin-node/issues/77
    'node/no-unpublished-require': 'off'
  })
};