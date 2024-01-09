import { reaction } from "mobx";
import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { ExampleRunner } from "./runners/example";

export class ExampleManager extends AppManager {
  runner: ExampleRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new ExampleRunner(this.project.emulator);
    reaction(
      () => JSON.stringify(this.toFileMap()),
      () => {
        this.runner.debounced.updateFiles(this.toFileMap());
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
