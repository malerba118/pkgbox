import { makeObservable, observable, runInAction, when } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { WebContainerProcess } from "@webcontainer/api";
import { InitializationStatus, Runner } from "./runner";

interface InstallOptions {
  force?: boolean;
}

export class TestsRunner extends Runner {
  process: WebContainerProcess | null = null;
  results: any;

  init = async (files: EmulatorFiles, packageId: string) => {
    this.setInitializationStatus(InitializationStatus.Initializating);
    console.log(files);
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

  updateFiles = async (files: EmulatorFiles) => {
    return this.emulator.post("/tests/files", files);
  };

  install = async (
    dependencies: string[] = [],
    options: InstallOptions = { force: false }
  ) => {
    return this.emulator.post("/tests/install", { dependencies, options });
  };

  startTests = async () => {
    await this.initialization;
    const nextProcess = await this.emulator.run("npm", [
      "--prefix",
      ".tests",
      "run",
      "test",
    ]);
    this.process?.kill();
    this.process = nextProcess;
  };
}
