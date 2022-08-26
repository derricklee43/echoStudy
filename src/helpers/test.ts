/**
 * Block level method that installs fake timers for the test callback and uninstalls it after.
 * @param testCallback the test function that can have async calls
 */
export async function withFakeTimers(testCallback: () => Promise<void> | void) {
  jest.useFakeTimers();
  try {
    await testCallback();
  } finally {
    jest.runOnlyPendingTimers(); // could use runAllTimers but this can get stuck if a task indefinitely schedules more macrotasks
    jest.useRealTimers();
  }
}
