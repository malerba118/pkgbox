import { action, makeObservable, observable } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { InitializationStatus, Runner } from "./runner";
import EventEmitter from "eventemitter3";
import { Subscriber } from "../types";
import { debounce } from "lodash";

export interface BuildResult {
  packageId: string;
  buildCount: number;
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

  constructor(emulator: Emulator) {
    super(emulator);
  }

  debounced = {
    updateFilesAndBuild: debounce((files: EmulatorFiles) => {
      this.updateFiles(files).then(() => {
        this.build();
      });
    }, 700),
  };

  init = async (files: EmulatorFiles) => {
    this.setInitializationStatus(InitializationStatus.Initializating);
    await this.updateFiles(files);
    const result = await this.build();
    this.setInitializationStatus(InitializationStatus.Initialized);
    return result;
  };

  updateFiles = async (files: EmulatorFiles) => {
    return this.emulator.post("/library/files", files);
  };

  install = async (dependency?: string) => {
    return this.emulator.post("/library/install", dependency);
  };

  build = async (): Promise<BuildResult> => {
    const result = await this.emulator.post("/library/build");
    this.buildCount++;
    this.events.emit("build", { ...result, buildCount: this.buildCount });
    return result;
  };

  onBuild = (subscriber: Subscriber<BuildResult>) => {
    this.events.on("build", subscriber);
    return () => this.events.off("build", subscriber);
  };
}
