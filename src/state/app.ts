import { action, computed, makeObservable, observable, values } from "mobx";
import { AppFile, AppFolder, FileMap, Project, Template } from "./types";
import { nanoid } from "nanoid";
import { removeForwardSlashes } from "../lib/utils";
import { FileManager, FolderManager } from "./fs";
import { ProjectManager } from "./project";
import JSON5 from "json5";

export interface App {
  files: AppFile[];
  folders: AppFolder[];
}

export abstract class AppManager {
  filesById: Record<string, FileManager> = {};
  foldersById: Record<string, FolderManager> = {};
  project: ProjectManager;
  activeFileId: string | null = null;
  tabIds: string[] = [];

  abstract get app_id(): "library" | "tests" | "example";

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
        // @ts-ignore
        app_id: this.app_id,
        project_id: this.project.id,
        // @ts-ignore
        name: this.app_id,
        folder_id: null,
        expanded: true,
      },
      this
    );
    makeObservable(this, {
      filesById: observable.shallow,
      foldersById: observable.shallow,
      tabIds: observable.shallow,
      files: computed,
      folders: computed,
      nodes: computed,
      activeFileId: observable.ref,
      setActiveFileId: action,
      createFileFromPath: action,
      createFilesFromFileMap: action,
      openFile: action,
      closeFile: action,
    });
  }

  openFile(file: FileManager) {
    if (!this.tabIds.includes(file.id)) {
      this.tabIds = [file.id, ...this.tabIds];
    }
    this.setActiveFileId(file.id);
  }

  closeFile(file: FileManager) {
    const fileIndex = this.tabIds.findIndex((fileId) => fileId === file.id);
    this.tabIds = this.tabIds.filter((fileId) => fileId !== file.id);
    if (this.activeFileId === file.id) {
      this.setActiveFileId(
        this.tabIds[fileIndex] || this.tabIds[fileIndex - 1] || null
      );
    }
  }

  get tabs() {
    return this.tabIds.map((fileId) => this.filesById[fileId]);
  }

  setActiveFileId(fileId: string | null) {
    this.activeFileId = fileId;
  }

  get activeFile() {
    return this.activeFileId ? this.filesById[this.activeFileId] || null : null;
  }

  get entrypoint(): FileManager | null {
    // console.log(this.packageJson);
    // return this.packageJson?.main
    //   ? this.getFileFromPath(this.packageJson?.main) || this.files[0]
    //   : this.files[0];
    const rootFiles = this.files.filter((file) => file.folder_id === "root");
    return (
      rootFiles.find((file) => {
        const fileName = file.name.toLowerCase();
        return (
          fileName.includes("app") ||
          fileName.includes("main") ||
          fileName.includes("index")
        );
      }) ||
      rootFiles[0] ||
      null
    );
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

  createFilesFromFileMap(fileMap: FileMap) {
    Object.entries(fileMap).forEach(([path, file]) => {
      this.createFileFromPath({ path, contents: file.code });
    });
  }

  createFileFromPath({
    path,
    contents = "",
  }: {
    path: string;
    contents?: string;
  }) {
    const parts = path.split("/").filter((part) => part.length > 0); // Split path and filter out empty parts
    let currentFolder = this.root;

    // Iterate over each part of the path except the last one (which is the file)
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];

      // Check if folder exists, if not, create it
      let folder = currentFolder.children.find((f) => f.name === part);
      if (!folder) {
        folder = currentFolder.createFolder({ name: part });
      } else if (folder instanceof FileManager) {
        throw new Error(
          "Cannot create folder because file already exists with this name"
        );
      }

      // Update currentFolder to the newly created or found folder
      currentFolder = folder;
    }

    // Create file in the final directory
    const fileName = parts.at(-1)!; // Get the file name, which is the last part of the path
    currentFolder.createFile({
      name: fileName,
      contents,
    });
  }

  toFileMap() {
    const fileMap: FileMap = {};
    this.files.forEach((file) => {
      fileMap[file.path] = {
        code: file.contents,
      };
    });
    return fileMap;
  }

  get typescriptConfig() {
    const file = this.files.find(
      (file) => file.name === "tsconfig.json" && file.folder_id === "root"
    );
    if (file) {
      try {
        return JSON5.parse(file.contents);
      } catch (err) {
        console.warn("Error parsing tsconfig.json");
        return null;
      }
    }
    return null;
  }

  get packageJson() {
    const file = this.files.find(
      (file) => file.name === "package.json" && file.folder_id === "root"
    );
    if (file) {
      try {
        return JSON5.parse(file.contents);
      } catch (err) {
        console.warn("Error parsing package.json");
        return null;
      }
    }
    return null;
  }

  get dependencies() {
    return {
      ...this.packageJson?.dependencies,
      ...this.packageJson?.devDependencies,
    };
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
