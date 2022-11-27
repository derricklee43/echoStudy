/**
 * ExtractIfArray<Promise<boolean>[]>  => Promise<boolean>
 * ExtractIfArray<number[]>            => number
 */
export type ExtractIfArray<T> = T extends (infer U)[] ? U : T;

/**
 * Coerces a type to not be a promise (by yielding `never`).
 *
 * NotPromise<Promise<boolean>>    => never
 * NotPromise<Promise<boolean>[]>  => never
 * NotPromise<boolean>             => boolean
 */
export type NotPromise<T> = ExtractIfArray<T> extends Promise<unknown>
  ? { TypeError: `type cannot be a promise, did you forget to await it?` }
  : T;
