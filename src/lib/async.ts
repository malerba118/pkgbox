type AsyncFunction = (...args: any[]) => Promise<any>;

export const createAsyncQueue = () => {
  let lastPromise = Promise.resolve();
  let activePromises: Promise<any>[] = [];

  return {
    Fn<T extends AsyncFunction>(
      asyncFn: T
    ): (...funcArgs: Parameters<T>) => ReturnType<T> {
      return function (...args: Parameters<T>): ReturnType<T> {
        const nextPromise = lastPromise.then(() =>
          asyncFn(...args)
        ) as ReturnType<T>;
        lastPromise = nextPromise.catch(() => {}); // Catch any error to ensure the chain continues
        activePromises.push(
          nextPromise.finally(() => {
            // Remove the promise from activePromises once it's settled
            activePromises = activePromises.filter((p) => p !== nextPromise);
          })
        );
        return nextPromise;
      };
    },
    async empty() {
      // Wait for all active promises to settle
      await Promise.all(activePromises);
    },
  };
};
