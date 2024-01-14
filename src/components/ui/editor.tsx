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

export const Editor = ({ onMount, children, ...otherProps }: EditorProps) => {
  const [context, setContext] = useState<EditorContextData | null>(null);
  const highlighterDisposerRef = useRef<() => void>();

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
        theme="tomorrow-night"
      />
    </EditorContext.Provider>
  );
};
