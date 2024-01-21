import { action, makeObservable, observable } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { InitializationStatus, Runner } from "./runner";
import EventEmitter from "eventemitter3";
import { AsyncStatus, FileMap, Subscriber } from "../types";
import { debounce } from "lodash";
import { createAsyncQueue } from "../../lib/async";

export interface BuildResult {
  packageId: string;
  buildCount: number;
  files?: FileMap;
}

enum ServerStatus {
  Starting = "starting",
  Started = "started",
  Stopped = "stopped",
  Error = "error",
}

export class LibraryRunner extends Runner {
  events = new EventEmitter();
  buildCount = 0;
  buildStatus = AsyncStatus.Idle;

  constructor(emulator: Emulator) {
    super(emulator);
    makeObservable(this, {
      buildStatus: observable.ref,
      setBuildStatus: action,
    });
  }

  debounced = {
    updateFilesAndBuild: debounce((files: EmulatorFiles) => {
      this.updateFiles(files).then(() => {
        this.build();
      });
    }, 0),
  };

  init = async (files: EmulatorFiles) => {
    console.log("Initializing library");
    this.setInitializationStatus(InitializationStatus.Initializating);
    await this.updateFiles(files);
    const result = await this.build();
    this.setInitializationStatus(InitializationStatus.Initialized);
    return result;
  };

  updateFiles = this.AsyncQueue.Fn(async (files: EmulatorFiles) => {
    console.log("Updating library files");
    return this.emulator.post("/library/files", files);
  });

  setBuildStatus(status: AsyncStatus) {
    this.buildStatus = status;
  }

  build = this.AsyncQueue.Fn(async (): Promise<BuildResult> => {
    this.setBuildStatus(AsyncStatus.Pending);
    try {
      const result = await this.emulator.post("/library/build");
      this.setBuildStatus(AsyncStatus.Success);
      this.buildCount++;
      this.events.emit("build", { ...result, buildCount: this.buildCount });
      return result;
    } catch (err) {
      this.setBuildStatus(AsyncStatus.Error);
      throw err;
    }
    // const result = await this.emulator.post("/library/build");
    // if (result.error) {
    //   this.setBuildStatus(AsyncStatus.Error);
    // } else {
    //   this.setBuildStatus(AsyncStatus.Success);
    // }
  });

  onBuild = (subscriber: Subscriber<BuildResult>) => {
    this.events.on("build", subscriber);
    return () => this.events.off("build", subscriber);
  };
}
