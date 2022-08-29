import { renderHook, act } from '@testing-library/react-hooks';
import { withFakeTimers } from '../../helpers/test';
import { useTimer } from '../use-timer';

describe('useTimer', () => {
  let mockCallback: jest.Mock<void, []>;
  beforeEach(() => {
    mockCallback = jest.fn();
  });

  it('should call callback when timer runs out after calling setTimer', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      jest.advanceTimersByTime(200);

      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('should not call callback before timer run out', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      jest.advanceTimersByTime(199);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  it('should not call callback when timer expires if pauseTimer is called', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      jest.advanceTimersByTime(100);
      act(() => result.current.pauseTimer());
      jest.advanceTimersByTime(100);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  it('should call callback when resumed and the timer runs out', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      jest.advanceTimersByTime(100);
      act(() => result.current.pauseTimer());
      jest.advanceTimersByTime(100);

      result.current.resumeTimer();
      jest.advanceTimersByTime(108);

      // expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('should not callback when resumed after clearing the timer', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      jest.advanceTimersByTime(100);
      act(() => result.current.clearTimer());
      act(() => result.current.resumeTimer());
      jest.advanceTimersByTime(100);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  it('should not call callback twice if setTimer is called twice', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      act(() => result.current.setTimer(mockCallback, 200));

      jest.advanceTimersByTime(200);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call callback twice if setTimer and resumeTimer is called ', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      act(() => result.current.resumeTimer());

      jest.advanceTimersByTime(200);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call callback twice if resumeTimer is called twice', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      act(() => result.current.resumeTimer());
      act(() => result.current.resumeTimer());

      jest.advanceTimersByTime(200);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('should allow new timers after timer has been cleared', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      act(() => result.current.clearTimer());

      act(() => result.current.setTimer(mockCallback, 200));
      jest.advanceTimersByTime(200);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('should not loose time when played and paused', () => {
    withFakeTimers(async () => {
      const { result } = renderHook(() => useTimer());

      act(() => result.current.setTimer(mockCallback, 500));
      jest.advanceTimersByTime(200); // total time elapsed on timer: 200
      act(() => result.current.pauseTimer());
      jest.advanceTimersByTime(200); // total time elapsed on timer: 200
      act(() => result.current.resumeTimer());
      act(() => result.current.pauseTimer());
      act(() => result.current.resumeTimer());

      jest.advanceTimersByTime(299); // total time elapsed on timer: 499
      expect(mockCallback).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1); // total time elapsed on timer: 500
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
