import {
  Monaco,
  Editor as ReactMonacoEditor,
  EditorProps as ReactMonacoEditorProps,
  useMonaco,
} from "@monaco-editor/react";
import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import type { editor as EditorTypes } from "monaco-editor";
import { initializeMonaco } from "./initialize-monaco";
import { useColorModeValue } from "@chakra-ui/react";

interface EditorProps extends ReactMonacoEditorProps {
  children?: ReactNode;
}

interface EditorContextData {
  editor: EditorTypes.IStandaloneCodeEditor;
  monaco: Monaco;
}

const EditorContext = createContext<EditorContextData | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor can only be used inside of an Editor");
  }
  return context;
};

const DEFAULT_OPTIONS: EditorTypes.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: 13,
  letterSpacing: -0.2,
  padding: { top: 12 },
  lineNumbersMinChars: 4,
  glyphMargin: false,
  lineDecorationsWidth: 3,
};

export const Editor = ({
  onMount,
  options,
  children,
  ...otherProps
}: EditorProps) => {
  const [context, setContext] = useState<EditorContextData | null>(null);
  const highlighterDisposerRef = useRef<() => void>();
  const theme = useColorModeValue("pkgbox-light", "pkgbox-dark");

  useEffect(() => {
    return () => {
      highlighterDisposerRef.current?.();
    };
  }, []);

  return (
    <EditorContext.Provider value={context}>
      {context && children}
      <ReactMonacoEditor
        className="editor"
        {...otherProps}
        beforeMount={initializeMonaco}
        onMount={(editor, monaco) => {
          setContext({ editor, monaco });
          onMount?.(editor, monaco);
        }}
        theme={theme}
        options={{
          ...DEFAULT_OPTIONS,
          ...options,
        }}
      />
    </EditorContext.Provider>
  );
};
