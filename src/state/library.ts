import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { FileMap } from "./types";
import { LibraryRunner } from "./runners/library";
import { debounce } from "lodash";

export class LibraryManager extends AppManager {
  runner: LibraryRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new LibraryRunner(this.project.emulator);
  }

  async init() {
    return this.runner.init(this.toFileMap());
  }

  get app_id() {
    return "library" as "library";
  }
}
