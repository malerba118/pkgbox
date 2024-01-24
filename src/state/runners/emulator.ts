import { SpawnOptions, WebContainer } from "@webcontainer/api";
import { files } from "./emulator-files";
import { nanoid } from "nanoid";
import { createAsyncQueue } from "../../lib/async";

export type EmulatorFiles = Record<string, { code: string }>;

export class Emulator {
  container: WebContainer;
  iframe: HTMLIFrameElement;
  AsyncQueue = createAsyncQueue();

  private constructor(container: WebContainer) {
    this.container = container;
    this.iframe = document.createElement("iframe");
    this.iframe.style.display = "none";
    document.body.appendChild(this.iframe);
  }

  run = async (command: string, args: string[], options?: SpawnOptions) => {
    const process = await this.container.spawn(command, args, options);
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );
    return process;
  };

  private startServer = async () => {
    await this.run("npm", ["run", "start"]);
    return new Promise<{ port: number; url: string }>((resolve) => {
      const unsubscribe = this.container.on("server-ready", (port, url) => {
        resolve({ port, url });
        unsubscribe();
      });
    });
  };

  private installDeps = async () => {
    const installProcess = await this.run("npm", ["install"]);
    await installProcess.exit;
  };

  private setIframeUrl = (url: string) => {
    return new Promise((resolve, reject) => {
      const onLoad = () => {
        resolve(undefined);
        this.iframe.removeEventListener("load", onLoad);
      };
      this.iframe.addEventListener("load", onLoad);
      const onError = () => {
        reject();
        this.iframe.removeEventListener("error", onError);
      };
      this.iframe.addEventListener("error", onError);
      this.iframe.src = url;
    });
  };

  static create = async () => {
    const container = await WebContainer.boot();
    await container.mount(files);
    const instance = new this(container);
    await instance.installDeps();
    const { url } = await instance.startServer();
    console.log(url);
    await instance.setIframeUrl(url);
    return instance;
  };

  post = async (url: string, body?: any): Promise<any> => {
    const requestId = nanoid();
    this.iframe.contentWindow?.postMessage(
      { requestId, method: "POST", url, body },
      "*"
    );
    return new Promise((resolve, reject) => {
      const listener = (event: any) => {
        if (event.data?.requestId === requestId) {
          if (event.data.ok) {
            resolve(event.data.body);
          } else {
            reject(event.data.body);
          }
          window.removeEventListener("message", listener);
        }
      };
      window.addEventListener("message", listener);
    });
  };

  get = async (url: string): Promise<any> => {
    const requestId = nanoid();
    this.iframe.contentWindow?.postMessage(
      { requestId, method: "GET", url },
      "*"
    );
    return new Promise((resolve, reject) => {
      const listener = (event: any) => {
        if (event.data?.requestId === requestId) {
          if (event.data.ok) {
            resolve(event.data.body);
          } else {
            reject(event.data.body);
          }
          window.removeEventListener("message", listener);
        }
      };
      window.addEventListener("message", listener);
    });
  };
}
