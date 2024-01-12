import { action, makeObservable, observable } from "mobx";
import { Emulator, EmulatorFiles } from "./emulator";
import { InitializationStatus, Runner } from "./runner";
import EventEmitter from "eventemitter3";
import { Subscriber } from "../types";
import { debounce } from "lodash";
import { createAsyncQueue } from "../../lib/async";
import { toast } from "sonner";

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
      toast("Building", { position: "bottom-left", duration: 2000 });
      this.updateFiles(files).then(() => {
        this.build();
      });
    }, 3000),
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

  build = this.AsyncQueue.Fn(async (): Promise<BuildResult> => {
    const result = await this.emulator.post("/library/build");
    this.buildCount++;
    this.events.emit("build", { ...result, buildCount: this.buildCount });
    return result;
  });

  onBuild = (subscriber: Subscriber<BuildResult>) => {
    this.events.on("build", subscriber);
    return () => this.events.off("build", subscriber);
  };
}
