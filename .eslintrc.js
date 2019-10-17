module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "standard",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "describe": "readonly",
        "it": "readonly",
        "before": "readonly",
        "after": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
      "space-before-function-paren": ["off", "never"],
      "constructor-super": ["warn"]
    }
};
