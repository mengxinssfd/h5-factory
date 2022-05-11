module.exports = {
  /* 指定如何解析语法。*/
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    // 禁止使用 var
    'no-var': 'error',
    'no-fallthrough': 'warn',
    // 下面两个规则可以去 参照4 规则看详细介绍
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 10,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/multi-word-component-names': 'warn',
    'vue/no-mutating-props': 'off',
    'vue/require-v-for-key': 'warn',
    'vue/valid-v-for': 'off',
  },
};
