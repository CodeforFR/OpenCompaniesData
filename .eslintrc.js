module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:nuxt/recommended",
  ],
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    // force semicolon at the end
    semi: [2, "always"],
    // use double quote
    quotes: ["error", "double"],
  },
};
