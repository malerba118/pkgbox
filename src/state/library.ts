import { App, AppManager } from "./app";
import { ProjectManager } from "./project";
import { FileMap } from "./types";
import { LibraryRunner } from "./runners/library";
import { debounce } from "lodash";
import { reaction } from "mobx";
import { InitializationStatus } from "./runners/runner";

export class LibraryManager extends AppManager {
  runner: LibraryRunner;

  constructor(data: App, project: ProjectManager) {
    super(data, project);
    this.runner = new LibraryRunner(this.project.emulator);
    reaction(
      () => this.toFileMap({ exclude: ["dist"] }),
      () => {
        if (
          this.runner.initializationStatus === InitializationStatus.Initialized
        ) {
          this.runner.debounced.updateFilesAndBuild(
            this.toFileMap({ exclude: ["dist"] })
          );
        }
      },
      {
        fireImmediately: false,
      }
    );
    this.runner.onBuild((result) => {
      if (result.files) {
        Object.keys(result.files).forEach((filePath) => {
          this.createFileFromPath({
            path: `dist/${filePath}`,
            contents: result.files![filePath].code,
            read_only: true,
          });
        });
      }
      // this.createFilesFromFileMap(result.)
    });
  }

  async init() {
    return this.runner.init(this.toFileMap());
  }

  get app_id() {
    return "library" as "library";
  }
}
