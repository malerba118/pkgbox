import { computed, makeObservable, observable, values } from "mobx";
import { AppFile, AppFolder, AppNode, Project } from "./types";
import { nanoid } from "nanoid";
import { removeForwardSlashes } from "../lib/utils";

class NodeManager {
  id: string;
  project_id: string;
  app_id: "library" | "example" | "tests";
  folder_id: string | null;
  name: string;
  hidden: boolean;
  read_only?: boolean;
  deleted_at?: number;
  app: AppManager;

  constructor(data: AppNode, app: AppManager) {
    this.id = data.id;
    this.app_id = data.app_id;
    this.project_id = data.project_id;
    this.folder_id = data.folder_id;
    this.name = data.name;
    this.hidden = data.hidden || false;
    this.read_only = data.read_only || false;
    this.app = app;
  }
}

class FileManager extends NodeManager {
  contents: string;

  constructor(data: AppFile, app: AppManager) {
    super(data, app);
    this.contents = data.contents;
  }
}

class FolderManager extends NodeManager {
  constructor(data: AppFolder, app: AppManager) {
    super(data, app);
  }

  createFolder(data: { name: string; hidden?: boolean; read_only?: boolean }) {
    return this.app.createFolder({
      ...data,
      folder_id: this.id,
    });
  }

  createFile(data: {
    name: string;
    contents?: string;
    hidden?: boolean;
    read_only?: boolean;
  }) {
    return this.app.createFile({
      ...data,
      folder_id: this.id,
    });
  }

  getChild(name: string) {
    return this.children.find((node) => node.name === name);
  }

  get children() {
    return this.app.nodes.filter((node) => {
      return node.folder_id === this.id;
    });
  }
}

interface App {
  files: AppFile[];
  folders: AppFolder[];
}

class AppManager {
  filesById: Record<string, FileManager> = {};
  foldersById: Record<string, FolderManager> = {};
  project: ProjectManager;

  get app_id() {
    return "library" as "library";
  }

  constructor(data: App, project: ProjectManager) {
    this.project = project;
    this.foldersById["root"] = new FolderManager(
      {
        id: "root",
        app_id: this.app_id,
        project_id: this.project.id,
        name: "root",
        folder_id: null,
      },
      this
    );
    data.files.forEach((file) => {
      this.filesById[file.id] = new FileManager(file, this);
    });
    data.folders.forEach((folder) => {
      this.foldersById[folder.id] = new FolderManager(folder, this);
    });
    makeObservable(this, {
      filesById: observable.shallow,
      foldersById: observable.shallow,
      files: computed,
      folders: computed,
      nodes: computed,
    });
  }

  createFile({
    name,
    contents = "",
    folder_id = "root",
    hidden = false,
    read_only = false,
  }: {
    name: string;
    contents?: string;
    folder_id?: string;
    hidden?: boolean;
    read_only?: boolean;
  }) {
    name = removeForwardSlashes(name);
    const file = new FileManager(
      {
        id: nanoid(),
        app_id: this.app_id,
        project_id: this.project.id,
        name,
        contents,
        folder_id,
        hidden,
        read_only,
      },
      this
    );
    this.filesById[file.id] = file;
    return file;
  }

  createFolder({
    name,
    folder_id = "root",
    hidden = false,
    read_only = false,
  }: {
    name: string;
    folder_id?: string;
    hidden?: boolean;
    read_only?: boolean;
  }) {
    name = removeForwardSlashes(name);
    const folder = new FolderManager(
      {
        id: nanoid(),
        app_id: this.app_id,
        project_id: this.project.id,
        name,
        folder_id: folder_id || "root",
        hidden,
        read_only,
      },
      this
    );
    this.foldersById[folder.id] = folder;
    return folder;
  }

  get files() {
    return values(this.filesById);
  }

  get folders() {
    return values(this.foldersById);
  }

  get nodes(): Array<FileManager | FolderManager> {
    return [...this.files, ...this.folders];
  }

  get root() {
    return this.foldersById["root"];
  }
}

export class ProjectManager {
  id: string;
  name: string;
  library: AppManager;

  constructor(data: Project) {
    this.id = data.id;
    this.name = data.name;
    this.library = new AppManager({ files: [], folders: [] }, this);
  }
}
