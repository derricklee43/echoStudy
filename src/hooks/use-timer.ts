import { useRef } from 'react';

export function useTimer() {
  const callbackRef = useRef<() => void>();
  const timerIdRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const remainingTimeRef = useRef<number>();

  function pause() {
    if (
      !callbackRef.current ||
      !timerIdRef.current ||
      !remainingTimeRef.current ||
      !startTimeRef.current
    ) {
      return;
    }

    window.clearTimeout(timerIdRef.current);
    timerIdRef.current = undefined;
    remainingTimeRef.current -= Date.now() - startTimeRef.current;
  }

  function resume() {
    if (
      !callbackRef.current ||
      timerIdRef.current ||
      !remainingTimeRef.current ||
      !startTimeRef.current
    ) {
      return;
    }
    setTimer(callbackRef.current, remainingTimeRef.current);
  }

  function setTimer(callback: () => void, delay: number) {
    const id = createTimeout(callback, delay);
    timerIdRef.current = id;
    callbackRef.current = callback;
    startTimeRef.current = Date.now();
    remainingTimeRef.current = delay;
  }

  function clearTimer() {
    window.clearTimeout(timerIdRef.current);
    callbackRef.current = undefined;
    timerIdRef.current = undefined;
    remainingTimeRef.current = undefined;
    startTimeRef.current = undefined;
  }

  function createTimeout(callback: () => void, delay: number) {
    return window.setTimeout(() => {
      callback();
      clearTimer();
    }, delay);
  }
  return [setTimer, clearTimer, pause, resume] as const;
}
