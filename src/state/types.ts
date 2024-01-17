export interface AppNode {
  id: string;
  project_id: string;
  app_id: "library" | "example" | "tests";
  folder_id: string | null;
  name: string;
  hidden?: boolean;
  read_only?: boolean;
  deleted_at?: number;
}

export interface AppFile extends AppNode {
  contents: string;
}

export interface AppFolder extends AppNode {
  expanded?: boolean;
}

export interface Project {
  id: string;
  name: string;
  files: AppFile[];
  folders: AppFolder[];
}

export type FileMap = Record<string, { code: string }>;

export type Template = {
  library: FileMap;
  example: FileMap;
  tests: FileMap;
};

export type Subscriber<T> = (event: T) => void;
export type Unsubscribe = () => void;
