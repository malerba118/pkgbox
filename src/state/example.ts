import { reaction } from "mobx";
import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { ExampleRunner } from "./runners/example";
import { InitializationStatus } from "./runners/runner";

export class ExampleManager extends AppManager {
  runner: ExampleRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new ExampleRunner(this.project.emulator);
    reaction(
      () => this.toFileMap(),
      () => {
        if (
          this.runner.initializationStatus === InitializationStatus.Initialized
        ) {
          this.runner.debounced.updateFiles(this.toFileMap());
        }
      },
      {
        fireImmediately: false,
      }
    );
  }

  async init(packageId: string) {
    return this.runner.init(this.toFileMap(), packageId);
  }

  get app_id() {
    return "example" as "example";
  }
}
