/*
 * @LastEditors: lvxw lv81567395@vip.qq.com
 * @LastEditTime: 2023-05-31 22:44:28
 */
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@babel/eslint-parser", // 解析器
  extends: [], // 扩展
  plugins: ["react"], // 插件
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  rules: {},
  parserOptions: {
    babelOptions: {
      presets: [
        ["babel-preset-react-app", false],
        "babel-preset-react-app/prod",
      ],
    },
  },
};
