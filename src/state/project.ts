import { action, makeObservable, observable } from "mobx";
import { Project, Template } from "./types";
import { LibraryManager } from "./library/manager";
import { ExampleManager } from "./example/manager";
import { Emulator } from "./emulator";

export class ProjectManager {
  id: string;
  name: string;
  activeApp: string;
  emulator: Emulator;
  library: LibraryManager;
  example: ExampleManager;
  initCount: number = 0;

  constructor(data: Project, emulator: Emulator) {
    this.id = data.id;
    this.name = data.name;
    this.activeApp = "library";
    this.emulator = emulator;
    this.library = new LibraryManager(
      {
        files: data.files.filter((file) => file.app_id === "library"),
        folders: data.folders.filter((folder) => folder.app_id === "library"),
      },
      this
    );
    this.example = new ExampleManager(
      {
        files: data.files.filter((file) => file.app_id === "example"),
        folders: data.folders.filter((folder) => folder.app_id === "example"),
      },
      this
    );
    makeObservable(this, {
      activeApp: observable.ref,
      setActiveApp: action,
    });
  }

  async init() {
    // prevent double init from useEffect stupidness
    if (this.initCount > 0) {
      return;
    }
    this.initCount++;
    const result = await this.library.init();
    await this.example.init(result.packageId);
  }

  setActiveApp(activeApp: string) {
    this.activeApp = activeApp;
  }

  createFilesFromTemplate(template: Template) {
    this.library.createFilesFromFileMap(template.library);
    this.example.createFilesFromFileMap(template.example);
    // this.tests.createFilesFromFileMap(template.tests);
  }
}
