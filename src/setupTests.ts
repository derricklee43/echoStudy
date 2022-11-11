/* eslint-disable @typescript-eslint/no-explicit-any */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/**
 * Globally disable all console messages.
 * Comment out specific lines to restore specific log levels.
 */
global.console = {
  ...console,
  // log: jest.fn(),
  // debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

/**
 * Mock MediaRecorder
 * https://github.com/facebook/jest/issues/10789
 */
Object.defineProperty(global, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    start: jest.fn(),
    ondataavailable: jest.fn(),
    onerror: jest.fn(),
    state: '',
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  })),
});

Object.defineProperty(MediaRecorder, 'isTypeSupported', {
  writable: true,
  value: () => true,
});

/*
 * Mock window methods
 */
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();
window.Worker = jest.fn().mockReturnValue({
  addEventListener: jest.fn(),
});

// attach global Howler to test environment
import { Howler } from 'howler';
(global as any).HowlerGlobal = Howler;

/*
 * Custom matchers; update `jest.d.ts` to provide typings for these matchers.
 *
 * The first argument is always the received value from expectation chaining.
 * You should not include the first argument in the declaration type (jest.d.ts)
 */
expect.extend({
  async toMatchPredicate(
    received: unknown,
    predicate: (received: unknown) => Promise<boolean> | boolean
  ) {
    const matched = await predicate(received);
    if (matched) {
      return {
        pass: true,
        message: () => `Expected ${received} not to match the predicate`,
      };
    } else {
      return {
        pass: false,
        message: () => `Expected ${received} to match the predicate`,
      };
    }
  },
});
