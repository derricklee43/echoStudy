import { useRef } from 'react';

export function useStopWatch() {
  const totalTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>();

  return { startStopWatch, pauseStopWatch, clearStopWatch, getElapsedTime };

  function startStopWatch() {
    if (startTimeRef.current !== undefined) {
      return;
    }
    startTimeRef.current = Date.now();
  }

  function getElapsedTime() {
    if (startTimeRef.current === undefined) {
      return totalTimeRef.current;
    }
    const elapsedTime = Date.now() - startTimeRef.current;
    return totalTimeRef.current + elapsedTime;
  }

  function pauseStopWatch() {
    if (startTimeRef.current === undefined) {
      return;
    }
    const elapsedTime = Date.now() - startTimeRef.current;
    totalTimeRef.current += elapsedTime;
    startTimeRef.current = undefined;
  }

  function clearStopWatch() {
    totalTimeRef.current = 0;
    startTimeRef.current = undefined;
  }
}
