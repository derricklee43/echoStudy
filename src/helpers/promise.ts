/**
 * Creates a deferred promise.
 * Use sparingly: https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern
 * The advantage of this is the ability to resolve a promise outside of its Promise scope.
 */
export function deferredPromise<U = unknown>(): {
  promise: Promise<U>;
  resolve: (value?: U) => void;
  reject: (reason?: unknown) => void;
} {
  const deferred: Record<string, unknown> = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred as {
    promise: Promise<U>;
    resolve: (value?: U) => void;
    reject: (reason?: unknown) => void;
  };
}
