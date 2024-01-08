import { action, makeObservable, observable, reaction } from "mobx";
import { Project, Template } from "./types";
import { LibraryManager } from "./library";
import { ExampleManager } from "./example";
import { Emulator } from "./runners/emulator";
import { TestsManager } from "./tests";

export class ProjectManager {
  id: string;
  name: string;
  activeApp: string;
  activePreview: string;
  emulator: Emulator;
  library: LibraryManager;
  example: ExampleManager;
  tests: TestsManager;
  initCount: number = 0;

  constructor(data: Project, emulator: Emulator) {
    this.id = data.id;
    this.name = data.name;
    this.activeApp = "library";
    this.activePreview = "example";
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
    this.tests = new TestsManager(
      {
        files: data.files.filter((file) => file.app_id === "tests"),
        folders: data.folders.filter((folder) => folder.app_id === "tests"),
      },
      this
    );
    makeObservable(this, {
      activeApp: observable.ref,
      setActiveApp: action,
      activePreview: observable.ref,
      setActivePreview: action,
    });
    this.library.runner.onBuild(async (result) => {
      if (this.activePreview === "example") {
        await this.example.runner.install([result.packageId]);
        await this.example.runner.startServer();
        // await this.tests.runner.install([result.packageId]);
        // await this.tests.runner.startTests();
      } else {
        // reverse the order
        await this.tests.runner.install([result.packageId]);
        await this.tests.runner.startTests();
        // await this.example.runner.install([result.packageId]);
        // await this.example.runner.startServer();
      }
    });
    reaction(
      () => JSON.stringify(this.library.toFileMap()),
      () => {
        this.library.runner.debounced.updateFilesAndBuild(
          this.library.toFileMap()
        );
      },
      {
        fireImmediately: false,
      }
    );
  }

  async init() {
    // prevent double init from useEffect stupidness
    if (this.initCount > 0) {
      return;
    }
    this.initCount++;
    const result = await this.library.init();
    await Promise.all([
      this.example.init(result.packageId),
      this.tests.init(result.packageId),
    ]);
  }

  setActiveApp(activeApp: string) {
    this.activeApp = activeApp;
  }

  setActivePreview(activePreview: string) {
    this.activePreview = activePreview;
  }

  createFilesFromTemplate(template: Template) {
    this.library.createFilesFromFileMap(template.library);
    this.example.createFilesFromFileMap(template.example);
    this.tests.createFilesFromFileMap(template.tests);
  }
}
