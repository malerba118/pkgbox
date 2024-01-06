import { action, computed, makeObservable, observable, values } from "mobx";
import { AppFile, AppFolder, Project } from "./types";
import { nanoid } from "nanoid";
import { removeForwardSlashes } from "../lib/utils";
import { FileManager, FolderManager } from "./fs";

export interface App {
  files: AppFile[];
  folders: AppFolder[];
}

export class AppManager {
  filesById: Record<string, FileManager> = {};
  foldersById: Record<string, FolderManager> = {};
  project: ProjectManager;
  activeFileId: string | null = null;

  get app_id() {
    return "library" as "library";
  }

  constructor(data: App, project: ProjectManager) {
    this.project = project;
    data.files.forEach((file) => {
      this.filesById[file.id] = new FileManager(file, this);
    });
    data.folders.forEach((folder) => {
      this.foldersById[folder.id] = new FolderManager(folder, this);
    });
    this.foldersById["root"] = new FolderManager(
      {
        id: "root",
        app_id: this.app_id,
        project_id: this.project.id,
        name: "",
        folder_id: null,
      },
      this
    );
    makeObservable(this, {
      filesById: observable.shallow,
      foldersById: observable.shallow,
      files: computed,
      folders: computed,
      nodes: computed,
      activeFileId: observable.ref,
      setActiveFileId: action,
    });
  }

  get activeFile() {
    return this.activeFileId ? this.filesById[this.activeFileId] : null;
  }

  setActiveFileId(fileId: string) {
    this.activeFileId = fileId;
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
