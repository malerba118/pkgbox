import { AppFile, AppFolder, AppNode } from "./types";
import { AppManager } from "./app";
import { action, makeObservable, observable } from "mobx";

export class NodeManager {
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

  get folder(): FolderManager | undefined {
    return this.folder_id ? this.app.foldersById[this.folder_id] : undefined;
  }

  get path(): string {
    if (this.folder && this.folder.id !== "root") {
      return `${this.folder.path}/${this.name}`;
    }
    return this.name;
  }

  get pathLength(): number {
    let length = 1;
    let folder = this.folder;
    while (folder) {
      length += 1;
      folder = folder.folder;
    }
    return length;
  }
}

export class FileManager extends NodeManager {
  contents: string;
  draftContents: string;

  constructor(data: AppFile, app: AppManager) {
    super(data, app);
    this.contents = data.contents;
    this.draftContents = data.contents;
    makeObservable(this, {
      contents: observable.ref,
      draftContents: observable.ref,
      setContents: action,
      setDraftContents: action,
    });
  }

  get isActive() {
    return this.app.activeFileId === this.id;
  }

  setContents(contents: string) {
    this.contents = contents;
    this.draftContents = contents;
  }

  setDraftContents(draftContents: string) {
    this.draftContents = draftContents;
  }

  save() {
    this.setContents(this.draftContents);
  }

  get isDirty() {
    return this.draftContents !== this.contents;
  }

  open() {
    this.app.openFile(this);
  }

  close() {
    this.app.closeFile(this);
  }
}

export class FolderManager extends NodeManager {
  expanded: boolean;
  constructor(data: AppFolder, app: AppManager) {
    super(data, app);
    this.expanded = data.expanded ?? false;
    makeObservable(this, {
      expanded: observable.ref,
      setExpanded: action,
    });
  }

  setExpanded(expanded: boolean) {
    this.expanded = expanded;
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
