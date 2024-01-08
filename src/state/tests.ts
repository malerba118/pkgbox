import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { TestsRunner } from "./runners/tests";

export class TestsManager extends AppManager {
  runner: TestsRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new TestsRunner(this.project.emulator);
  }

  async init(packageId: string) {
    return this.runner.init(this.toFileMap(), packageId);
  }

  get app_id() {
    return "tests" as "tests";
  }
}
