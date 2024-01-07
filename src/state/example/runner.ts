import { makeObservable, observable, runInAction } from "mobx";
import { Emulator, EmulatorFiles } from "../emulator";
import { WebContainerProcess } from "@webcontainer/api";

interface InstallOptions {
  force?: boolean;
}

export class ExampleRunner {
  emulator: Emulator;
  serverProcess: WebContainerProcess | null = null;
  url: string | null = null;
  port: number | null = null;

  constructor(emulator: Emulator) {
    this.emulator = emulator;
    makeObservable(this, { url: observable.ref, port: observable.ref });
  }

  init = async (files: EmulatorFiles, packageId: string) => {
    await this.updateFiles(files);
    await this.install([packageId]);
    // await this.startServer();
  };

  updateFiles = async (files: EmulatorFiles) => {
    return this.emulator.post("/app/files", files);
  };

  install = async (
    dependencies: string[] = [],
    options: InstallOptions = { force: false }
  ) => {
    console.log("installing app dependencies: " + dependencies.join(","));
    return this.emulator.post("/app/install", { dependencies, options });
  };

  startServer = async () => {
    const nextServerProcess = await this.emulator.run("npm", [
      "--prefix",
      ".app",
      "run",
      "dev",
    ]);
    this.serverProcess?.kill();
    this.serverProcess = nextServerProcess;
    return new Promise<{ port: number; url: string }>((resolve) => {
      const unsubscribe = this.emulator.container.on(
        "server-ready",
        (port, url) => {
          runInAction(() => {
            this.port = port;
            this.url = url;
          });
          unsubscribe();
          resolve({ port, url });
        }
      );
    });
  };
}
