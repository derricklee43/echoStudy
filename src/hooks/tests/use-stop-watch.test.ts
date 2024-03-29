import { act, renderHook } from '@testing-library/react-hooks';
import { withFakeTimers } from '@/helpers/test';
import { useStopWatch } from '@/hooks/use-stop-watch';

describe('useStopWatch', () => {
  const setup = () => {
    const { result } = renderHook(() => useStopWatch());
    return result.current;
  };

  it('should getElapsedTime after starting', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime } = setup();
      const testTime = 200;
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(testTime);
      });
    });
  });

  it('the elapsed time should not increase when paused', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime, pauseStopWatch } = setup();
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => pauseStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(200);
      });
    });
  });

  it('the elapsed time should be zero when cleared', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime, clearStopWatch } = setup();
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => clearStopWatch());
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(0);
      });
    });
  });

  it('the timer should work again after being cleared', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime, clearStopWatch } = setup();
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => clearStopWatch());
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(200);
      });
    });
  });

  it('calling getElapsedTime should update after waiting', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime } = setup();
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(200);
      });
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(400);
      });
    });
  });

  it('calling pause twice should not affect stopwatch', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime, pauseStopWatch } = setup();
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => pauseStopWatch());
      act(() => pauseStopWatch());
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(200);
      });
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(400);
      });
    });
  });

  it('calling start twice should not affect stopwatch', () => {
    return withFakeTimers(async () => {
      const { startStopWatch, getElapsedTime, pauseStopWatch } = setup();
      act(() => startStopWatch());
      act(() => startStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(200);
      });
      act(() => pauseStopWatch());
      jest.advanceTimersByTime(200);
      act(() => {
        const elapsedTime = getElapsedTime();
        expect(elapsedTime).toEqual(200);
      });
    });
  });
});
