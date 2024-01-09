import { action, makeObservable, observable, runInAction, when } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { WebContainerProcess } from "@webcontainer/api";
import { InitializationStatus, Runner } from "./runner";
import { debounce } from "lodash";

interface InstallOptions {
  force?: boolean;
}

export enum ServerStatus {
  Starting = "starting",
  Started = "started",
  Stopped = "stopped",
  Error = "error",
}

export class ExampleRunner extends Runner {
  serverProcess: WebContainerProcess | null = null;
  installProcess: WebContainerProcess | null = null;
  url: string | null = null;
  port: number | null = null;
  serverStatus: ServerStatus;

  constructor(emulator: Emulator) {
    super(emulator);
    this.serverStatus = ServerStatus.Stopped;
    makeObservable(this, {
      url: observable.ref,
      port: observable.ref,
      serverStatus: observable.ref,
      setServerStatus: action,
    });
  }

  debounced = {
    updateFiles: debounce((files: EmulatorFiles) => {
      this.updateFiles(files);
    }, 700),
  };

  setServerStatus(status: ServerStatus) {
    this.serverStatus = status;
  }

  init = async (files: EmulatorFiles, packageId: string) => {
    this.setInitializationStatus(InitializationStatus.Initializating);
    await this.updateFiles(files);
    await this.install([packageId]);
    this.setInitializationStatus(InitializationStatus.Initialized);
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
    this.installProcess?.kill();
    this.installProcess = await this.emulator.run("npm", [
      "--prefix",
      ".app",
      "install",
      ...dependencies,
    ]);
    // return this.emulator.post("/app/install", { dependencies, options });
  };

  start = async () => {
    // if (
    //   this.serverStatus === ServerStatus.Starting
    // ) {
    //   return;
    // }
    this.setServerStatus(ServerStatus.Starting);
    await this.initialization;
    this.stop();
    this.serverProcess = await this.emulator.run("npm", [
      "--prefix",
      ".app",
      "run",
      "dev",
    ]);
    return new Promise<{ port: number; url: string }>((resolve) => {
      const unsubscribe = this.emulator.container.on(
        "server-ready",
        (port, url) => {
          runInAction(() => {
            this.port = port;
            this.url = url;
          });
          this.setServerStatus(ServerStatus.Started);
          unsubscribe();
          resolve({ port, url });
        }
      );
    });
  };

  stop = () => {
    this.serverProcess?.kill();
    this.serverProcess = null;
  };
}
