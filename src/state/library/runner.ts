import { action, makeObservable, observable } from "mobx";
import { Emulator, EmulatorFiles } from "../emulator";

export interface BuildResult {
  packageId: string;
}

interface Initialization {
  status: InitializationStatus;
  result?: BuildResult;
}

enum InitializationStatus {
  Uninitialized = "uninitialized",
  Initializating = "initializing",
  Initialized = "initialized",
  Error = "error",
}

enum ServerStatus {
  Starting = "starting",
  Started = "started",
  Stopped = "stopped",
  Error = "error",
}

export class LibraryRunner {
  emulator: Emulator;
  initialization: Initialization;

  constructor(emulator: Emulator) {
    this.emulator = emulator;
    this.initialization = {
      status: InitializationStatus.Uninitialized,
    };
    makeObservable(this, {
      initialization: observable,
      setInitialization: action,
    });
  }

  setInitialization(initialization: Initialization) {
    this.initialization = initialization;
  }

  init = async (files: EmulatorFiles) => {
    this.setInitialization({ status: InitializationStatus.Initializating });
    this.initialization = await this.updateFiles(files);
    const result = await this.build();
    this.setInitialization({
      status: InitializationStatus.Initialized,
      result,
    });
    return result;
  };

  updateFiles = async (files: EmulatorFiles) => {
    return this.emulator.post("/library/files", files);
  };

  install = async (dependency?: string) => {
    return this.emulator.post("/library/install", dependency);
  };

  build = async (): Promise<BuildResult> => {
    return this.emulator.post("/library/build");
  };
}
