import { action, makeObservable, observable, when } from "mobx";
import { Emulator } from "./emulator";

export enum InitializationStatus {
  Uninitialized = "uninitialized",
  Initializating = "initializing",
  Initialized = "initialized",
  Error = "error",
}

export abstract class Runner {
  emulator: Emulator;
  initialization: Promise<void>;

  abstract init(...args: any[]): Promise<any>;
  initializationStatus: InitializationStatus;

  constructor(emulator: Emulator) {
    this.emulator = emulator;
    this.initializationStatus = InitializationStatus.Uninitialized;
    makeObservable(this, {
      initializationStatus: observable.ref,
      setInitializationStatus: action,
    });
    this.initialization = when(
      () => this.initializationStatus === InitializationStatus.Initialized
    );
  }

  setInitializationStatus(status: InitializationStatus) {
    this.initializationStatus = status;
  }
}
