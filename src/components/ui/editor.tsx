import {
  Monaco,
  Editor as ReactMonacoEditor,
  EditorProps as ReactMonacoEditorProps,
} from "@monaco-editor/react";
import { ReactNode, useState, createContext, useContext } from "react";
import type { editor as EditorTypes } from "monaco-editor";

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

  return (
    <EditorContext.Provider value={context}>
      {context && children}
      <ReactMonacoEditor
        {...otherProps}
        onMount={(editor, monaco) => {
          setContext({ editor, monaco });
          onMount?.(editor, monaco);
        }}
      />
    </EditorContext.Provider>
  );
};
