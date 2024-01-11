import { makeObservable, observable, runInAction, when } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { WebContainerProcess } from "@webcontainer/api";
import { InitializationStatus, Runner } from "./runner";
import { debounce } from "lodash";

interface InstallOptions {
  force?: boolean;
}

export class TestsRunner extends Runner {
  installProcess: WebContainerProcess | null = null;
  serverProcess: WebContainerProcess | null = null;
  results: any;

  constructor(emulator: Emulator) {
    super(emulator);
    this.results = null;
    makeObservable(this, {
      results: observable.ref,
    });
  }

  debounced = {
    updateFiles: debounce((files: EmulatorFiles) => {
      this.updateFiles(files);
    }, 1000),
  };

  init = async (files: EmulatorFiles, packageId: string) => {
    console.log("Initializing tests");
    this.setInitializationStatus(InitializationStatus.Initializating);
    await this.updateFiles(files);
    await this.install([packageId]);
    this.emulator.container.fs.watch(".tests/output.json", (action) => {
      if (action === "change") {
        this.emulator.container.fs
          .readFile(".tests/output.json", "utf8")
          .then((data) => {
            try {
              runInAction(() => {
                this.results = JSON.parse(data);
              });
              console.log(this.results);
            } catch (err) {
              console.error("Failed to parse test output");
            }
          });
      }
    });
    this.setInitializationStatus(InitializationStatus.Initialized);
  };

  updateFiles = this.AsyncQueue.Fn(async (files: EmulatorFiles) => {
    console.log("Updating tests files");
    return this.emulator.post("/tests/files", files);
  });

  install = this.AsyncQueue.Fn(
    async (
      dependencies: string[] = [],
      options: InstallOptions = { force: false }
    ) => {
      console.log("Install tests dependencies");
      this.installProcess?.kill();
      this.installProcess = await this.emulator.run("npm", [
        "--prefix",
        ".tests",
        "install",
        "--no-audit",
        "--no-fund",
        "--no-progress",
        // "--no-package-lock",
        ...dependencies,
      ]);
      return this.installProcess.exit;
      // return this.emulator.post("/tests/install", { dependencies, options });
    }
  );

  start = async () => {
    await this.initialization;
    this.stop();
    this.serverProcess = await this.emulator.run("npm", [
      "--prefix",
      ".tests",
      "run",
      "test",
    ]);
  };

  stop = () => {
    this.serverProcess?.kill();
    this.serverProcess = null;
  };
}
