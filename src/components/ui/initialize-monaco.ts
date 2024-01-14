import type { Monaco } from "@monaco-editor/react";
import { wireTmGrammars } from "monaco-editor-textmate";
import { Registry } from "monaco-textmate";
import { loadWASM } from "onigasm";

import tomorrowNight from "monaco-themes/themes/Tomorrow-Night.json";
import { vsDarkPlus } from "./vs-dark-plus";
import { convertVsCodeTheme } from "./define-theme";

export async function initializeMonaco(monaco: Monaco) {
  try {
    await loadWASM("/onigasm.wasm");
  } catch {
    // try/catch prevents onigasm from erroring on fast refreshes
  }

  const registry = new Registry({
    // @ts-ignore
    getGrammarDefinition: async (scopeName) => {
      switch (scopeName) {
        case "source.js":
          return {
            format: "json",
            content: await (await fetch("/javascript.tmLanguage.json")).text(),
          };
        case "source.jsx":
          return {
            format: "json",
            content: await (await fetch("/jsx.tmLanguage.json")).text(),
          };
        case "source.ts":
          return {
            format: "json",
            content: await (await fetch("/typescript.tmLanguage.json")).text(),
          };
        case "source.tsx":
          return {
            format: "json",
            content: await (await fetch("/tsx.tmLanguage.json")).text(),
          };
        default:
          return null;
      }
    },
  });

  const grammars = new Map();

  grammars.set("javascript", "source.jsx");
  grammars.set("typescript", "source.tsx");

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
    esModuleInterop: true,
  });

  console.log(tomorrowNight);

  const theme = convertVsCodeTheme(vsDarkPlus);

  theme.rules.push(
    {
      token: "entity.name.tag",
      foreground: "#569cd6",
    },
    {
      token: "entity.other.attribute-name",
      foreground: "#9cdcfe",
    },
    {
      foreground: "#569cd6",
      token: "storage.type",
    },
    {
      foreground: "#569cd6",
      token: "storage.modifier",
    },
    {
      foreground: "#ce9178",
      token: "punctuation.definition.string",
    }
  );

  //   monaco.editor.defineTheme("tomorrow-night", tomorrowNight as any);
  monaco.editor.defineTheme("tomorrow-night", theme as any);
  monaco.editor.setTheme("tomorrow-night");

  /* Wire up TextMate grammars */
  await wireTmGrammars(monaco, registry, grammars);
}
