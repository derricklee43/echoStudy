declare namespace jest {
  interface Matchers<R> {
    toMatchPredicate(predicate: (received: unknown) => Promise<boolean> | boolean): R;
  }
}
