import { reaction } from "mobx";
import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { TestsRunner } from "./runners/tests";
import { InitializationStatus } from "./runners/runner";

export class TestsManager extends AppManager {
  runner: TestsRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new TestsRunner(this.project.emulator);
    reaction(
      () => this.toFileMap(),
      () => {
        if (
          this.runner.initializationStatus === InitializationStatus.Initialized
        ) {
          console.log("maybe");
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
    return "tests" as "tests";
  }
}
