import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { ExampleRunner } from "./runners/example";

export class ExampleManager extends AppManager {
  runner: ExampleRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new ExampleRunner(this.project.emulator);
  }

  async init(packageId: string) {
    return this.runner.init(this.toFileMap(), packageId);
  }

  get app_id() {
    return "example" as "example";
  }
}
