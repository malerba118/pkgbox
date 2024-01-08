import { action, makeObservable, observable, runInAction, when } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { WebContainerProcess } from "@webcontainer/api";
import { InitializationStatus, Runner } from "./runner";

interface InstallOptions {
  force?: boolean;
}

enum ServerStatus {
  Starting = "starting",
  Started = "started",
  Stopped = "stopped",
  Error = "error",
}

export class ExampleRunner extends Runner {
  serverProcess: WebContainerProcess | null = null;
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
    return this.emulator.post("/app/install", { dependencies, options });
  };

  startServer = async () => {
    // if (
    //   this.serverStatus === ServerStatus.Starting
    // ) {
    //   return;
    // }
    this.setServerStatus(ServerStatus.Starting);
    await this.initialization;
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
          this.setServerStatus(ServerStatus.Started);
          unsubscribe();
          resolve({ port, url });
        }
      );
    });
  };
}
