import { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

export const DEFAULT_COMPILER_OPTIONS = {
  //   target: monaco.languages.typescript.ScriptTarget.Latest,
  //   allowNonTsExtensions: true,
  //   resolveJsonModule: true,
  //   moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  //   module: monaco.languages.typescript.ModuleKind.CommonJS,
  //   typeRoots: ["node_modules/@types"],
  //   allowSyntheticDefaultImports: true,
  //   strict: true,
  //   noImplicitAny: false,
  //   allowImportingTsExtensions: true,
  //   noEmit: true,
  //   esModuleInterop: true,
  //   jsx: monaco.languages.typescript.JsxEmit.Preserve,
  //   reactNamespace: "React",
  allowJs: true,
};

type CompilerOptions = ReturnType<
  typeof monaco.languages.typescript.typescriptDefaults.getCompilerOptions
>;

export const tsConfigToCompilerOptions = (
  compilerOptions: any
): CompilerOptions => {
  return {
    ...DEFAULT_COMPILER_OPTIONS,
    ...compilerOptions,
    target: mapTarget(compilerOptions?.target),
    module: mapModule(compilerOptions?.module),
    moduleResolution: mapModuleResolution(compilerOptions?.moduleResolution),
  };
};

function mapTarget(
  scriptTarget: string | undefined
): CompilerOptions["target"] {
  const monacoScriptTarget = monaco.languages.typescript.ScriptTarget;
  switch (scriptTarget?.toLowerCase()) {
    case "es3":
      return monacoScriptTarget.ES3;
    case "es5":
      return monacoScriptTarget.ES5;
    case "es6":
    case "es2015":
      return monacoScriptTarget.ES2015;
    case "es2016":
      return monacoScriptTarget.ES2016;
    case "es2017":
      return monacoScriptTarget.ES2017;
    case "es2018":
      return monacoScriptTarget.ES2018;
    case "es2019":
      return monacoScriptTarget.ES2019;
    case "es2020":
      return monacoScriptTarget.ES2020;
    case "es2021":
      // If Monaco doesn't explicitly have ES2021, use Latest or a suitable fallback
      return monacoScriptTarget.Latest;
    case "es2022":
      // If Monaco doesn't explicitly have ES2022, use Latest or a suitable fallback
      return monacoScriptTarget.Latest;
    case "esnext":
      return monacoScriptTarget.ESNext;
    default:
      return monacoScriptTarget.Latest; // Default fallback
  }
}

function mapModuleResolution(moduleResolution: string | undefined) {
  const monacoModuleResolution =
    monaco.languages.typescript.ModuleResolutionKind;

  switch (moduleResolution?.toLowerCase()) {
    case "classic":
      return monacoModuleResolution.Classic;
    case "node":
    case "nodejs":
      return monacoModuleResolution.NodeJs;
    default:
      return monacoModuleResolution.NodeJs; // Default to NodeJs if undefined or not recognized
  }
}

function mapModule(moduleType: string | undefined) {
  const monacoModuleKind = monaco.languages.typescript.ModuleKind;

  switch (moduleType?.toLowerCase()) {
    case "none":
      return monacoModuleKind.None;
    case "commonjs":
      return monacoModuleKind.CommonJS;
    case "amd":
      return monacoModuleKind.AMD;
    case "umd":
      return monacoModuleKind.UMD;
    case "system":
      return monacoModuleKind.System;
    case "es2015":
    case "es6": // Assuming es6 is equivalent to es2015 for module kind
      return monacoModuleKind.ES2015;
    case "esnext":
      return monacoModuleKind.ESNext;
    default:
      return monacoModuleKind.None; // Default fallback, can be changed based on your requirements
  }
}
