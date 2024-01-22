import { action, makeObservable, observable, reaction, when } from "mobx";
import { Project, Template } from "./types";
import { LibraryManager } from "./library";
import { ExampleManager } from "./example";
import { Emulator } from "./runners/emulator";
import { TestsManager } from "./tests";
import { nanoid } from "nanoid";
import { TemplateOptions, getTemplate } from "../templates";
import { LibraryTemplateType } from "../templates/library";
import { ExampleTemplateType } from "../templates/example";
import { createAsyncQueue } from "../lib/async";

export class ProjectManager {
  id: string;
  name: string;
  activeAppId: string;
  activePreview: string;
  emulator: Emulator;
  library: LibraryManager;
  example: ExampleManager;
  tests: TestsManager;
  initCount: number = 0;

  constructor(data: Project | TemplateOptions, emulator: Emulator) {
    this.activeAppId = "library";
    this.activePreview = "example";
    this.emulator = emulator;
    if ("id" in data) {
      this.id = data.id;
      this.name = data.name;
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
    } else {
      this.id = nanoid();
      this.name = data.name;
      this.library = new LibraryManager(
        {
          files: [],
          folders: [],
        },
        this
      );
      this.example = new ExampleManager(
        {
          files: [],
          folders: [],
        },
        this
      );
      this.tests = new TestsManager(
        {
          files: [],
          folders: [],
        },
        this
      );
      this.createFilesFromTemplate(getTemplate(data));
    }
    makeObservable(this, {
      activeAppId: observable.ref,
      setActiveAppId: action,
      activePreview: observable.ref,
      setActivePreview: action,
      createFilesFromTemplate: action,
    });
    const afterBuild = this.emulator.AsyncQueue.Fn(async (result) => {
      if (this.activePreview === "example") {
        if (result.buildCount > 1)
          await this.example.runner.install([result.packageId]);
        await this.example.runner.start();
        if (result.buildCount > 1)
          await this.tests.runner.install([result.packageId]);
        // await this.tests.runner.startTests();
      } else {
        // reverse the order
        if (result.buildCount > 1)
          await this.tests.runner.install([result.packageId]);
        await this.tests.runner.start();
        if (result.buildCount > 1)
          await this.example.runner.install([result.packageId]);
        // await this.example.runner.startServer();
      }
    });
    this.library.runner.onBuild(afterBuild);
    reaction(
      () => this.activePreview,
      () => {
        if (this.activePreview === "example") {
          this.tests.runner.stop();
          this.example.runner.start();
        } else {
          this.example.runner.stop();
          this.tests.runner.start();
        }
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

  get activeApp() {
    if (this.activeAppId === "library") {
      return this.library;
    } else if (this.activeAppId === "example") {
      return this.example;
    }
    return this.tests;
  }

  setActiveAppId(activeAppId: string) {
    this.activeAppId = activeAppId;
  }

  setActivePreview(activePreview: string) {
    this.activePreview = activePreview;
  }

  createFilesFromTemplate(template: Template) {
    this.library.createFilesFromFileMap(template.library);
    if (this.library.entrypoint) this.library.openFile(this.library.entrypoint);
    // this.library.files.forEach((f) => this.library.openFile(f));
    this.example.createFilesFromFileMap(template.example);
    if (this.example.entrypoint) this.example.openFile(this.example.entrypoint);
    // this.example.files.forEach((f) => this.example.openFile(f));
    this.tests.createFilesFromFileMap(template.tests);
    if (this.tests.entrypoint) this.tests.openFile(this.tests.entrypoint);
  }

  dispose() {
    this.emulator.container.teardown();
  }
}
