module.exports = {
  "extends": ["stylelint-config-standard", "stylelint-config-recess-order"],
  "rules": {
      "at-rule-no-unknown": [true, {"ignoreAtRules": ["mixin", "extend", "content"]}]
  }
}
