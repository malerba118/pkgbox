export const vsDarkPlus = {
  $schema: "vscode://schemas/color-theme",
  name: "Dark+ (default dark)",
  include: "./dark_vs.json",
  tokenColors: [
    {
      name: "Function declarations",
      scope: [
        "entity.name.function",
        "support.function",
        "support.constant.handlebars",
        "source.powershell variable.other.member",
        "entity.name.operator.custom-literal", // See https://en.cppreference.com/w/cpp/language/user_literal
      ],
      settings: {
        foreground: "#DCDCAA",
      },
    },
    {
      name: "Types declaration and references",
      scope: [
        "support.class",
        "support.type",
        "entity.name.type",
        "entity.name.namespace",
        "entity.other.attribute",
        "entity.name.scope-resolution",
        "entity.name.class",
        "storage.type.numeric.go",
        "storage.type.byte.go",
        "storage.type.boolean.go",
        "storage.type.string.go",
        "storage.type.uintptr.go",
        "storage.type.error.go",
        "storage.type.rune.go",
        "storage.type.cs",
        "storage.type.generic.cs",
        "storage.type.modifier.cs",
        "storage.type.variable.cs",
        "storage.type.annotation.java",
        "storage.type.generic.java",
        "storage.type.java",
        "storage.type.object.array.java",
        "storage.type.primitive.array.java",
        "storage.type.primitive.java",
        "storage.type.token.java",
        "storage.type.groovy",
        "storage.type.annotation.groovy",
        "storage.type.parameters.groovy",
        "storage.type.generic.groovy",
        "storage.type.object.array.groovy",
        "storage.type.primitive.array.groovy",
        "storage.type.primitive.groovy",
      ],
      settings: {
        foreground: "#4EC9B0",
      },
    },
    {
      name: "Types declaration and references, TS grammar specific",
      scope: [
        "meta.type.cast.expr",
        "meta.type.new.expr",
        "support.constant.math",
        "support.constant.dom",
        "support.constant.json",
        "entity.other.inherited-class",
      ],
      settings: {
        foreground: "#4EC9B0",
      },
    },
    {
      name: "Control flow / Special keywords",
      scope: [
        "keyword.control",
        "source.cpp keyword.operator.new",
        "keyword.operator.delete",
        "keyword.other.using",
        "keyword.other.operator",
        "entity.name.operator",
      ],
      settings: {
        foreground: "#C586C0",
      },
    },
    {
      name: "Variable and parameter name",
      scope: [
        "variable",
        "meta.definition.variable.name",
        "support.variable",
        "entity.name.variable",
        "constant.other.placeholder", // placeholders in strings
      ],
      settings: {
        foreground: "#9CDCFE",
      },
    },
    {
      name: "Constants and enums",
      scope: ["variable.other.constant", "variable.other.enummember"],
      settings: {
        foreground: "#4FC1FF",
      },
    },
    {
      name: "Object keys, TS grammar specific",
      scope: ["meta.object-literal.key"],
      settings: {
        foreground: "#9CDCFE",
      },
    },
    {
      name: "CSS property value",
      scope: [
        "support.constant.property-value",
        "support.constant.font-name",
        "support.constant.media-type",
        "support.constant.media",
        "constant.other.color.rgb-value",
        "constant.other.rgb-value",
        "support.constant.color",
      ],
      settings: {
        foreground: "#CE9178",
      },
    },
    {
      name: "Regular expression groups",
      scope: [
        "punctuation.definition.group.regexp",
        "punctuation.definition.group.assertion.regexp",
        "punctuation.definition.character-class.regexp",
        "punctuation.character.set.begin.regexp",
        "punctuation.character.set.end.regexp",
        "keyword.operator.negation.regexp",
        "support.other.parenthesis.regexp",
      ],
      settings: {
        foreground: "#CE9178",
      },
    },
    {
      scope: [
        "constant.character.character-class.regexp",
        "constant.other.character-class.set.regexp",
        "constant.other.character-class.regexp",
        "constant.character.set.regexp",
      ],
      settings: {
        foreground: "#d16969",
      },
    },
    {
      scope: ["keyword.operator.or.regexp", "keyword.control.anchor.regexp"],
      settings: {
        foreground: "#DCDCAA",
      },
    },
    {
      scope: "keyword.operator.quantifier.regexp",
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "constant.character",
      settings: {
        foreground: "#569cd6",
      },
    },
    {
      scope: "constant.character.escape",
      settings: {
        foreground: "#d7ba7d",
      },
    },
    {
      scope: "entity.name.label",
      settings: {
        foreground: "#C8C8C8",
      },
    },
  ],
  semanticTokenColors: {
    newOperator: "#C586C0",
    stringLiteral: "#ce9178",
    customLiteral: "#DCDCAA",
    numberLiteral: "#b5cea8",
  },
};
