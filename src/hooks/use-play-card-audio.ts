import { useEffect, useRef } from 'react';
import { LazyAudio } from '@/models/lazy-audio';
import { useMountedRef } from './use-mounted-ref';
import { useTimer } from './use-timer';

export function usePlayCardAudio() {
  // timer used to create wait periods between audios
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();

  // whenever this is undefined, we are in a wait period
  const activeAudioRef = useRef<LazyAudio>();

  // lifecycle hook to ensure audio is stopped
  const mountedRef = useMountedRef();
  useEffect(() => {
    return () => clearAudio();
  }, []);

  return {
    clearAudio,
    playAudio,
    pauseAudio,
    resumeAudio,
  };

  function pauseAudio() {
    if (!activeAudioRef.current) {
      pauseTimer();
      return;
    }
    activeAudioRef.current.pause();
  }

  function resumeAudio() {
    if (!activeAudioRef.current) {
      resumeTimer();
      return;
    }
    activeAudioRef.current.play();
  }

  function clearAudio() {
    if (!activeAudioRef.current) {
      clearTimer();
      return;
    }
    activeAudioRef.current.stop();
  }

  /**
   * @param audio the audio file to play
   * @param playCount how many times to play this audio
   * @param playOptions options to set for playing the audio
   *   @param firstPlayPause (0) how to wait in ms before playing for this audio for the first time
   *   @param lastPause (0) how to wait in m after the last play (when times = 1) before resolving
   */
  async function playAudio(
    audio: LazyAudio,
    playCount = 1,
    playOptions?: { firstPlayPause?: number; lastPause?: number }
  ): Promise<void> {
    activeAudioRef.current?.stop();

    if (playCount === 0) {
      return;
    }

    // only on the first play, wait this duration
    if (playOptions?.firstPlayPause) {
      await wait(playOptions?.firstPlayPause);
      playOptions = { ...playOptions, firstPlayPause: 0 };
    }

    if (playCount === 1) {
      await playCardAudio(audio);
      return wait(playOptions?.lastPause ?? 0); // unexpectedly, having a small wait makes the app more 'smooth'
    }

    const duration = await audio.durationAsync();
    await wait(getPauseLength(duration));
    return playAudio(audio, playCount - 1, playOptions);
  }

  function getPauseLength(audioDuration: number) {
    const durationInSeconds = audioDuration * 1000;
    return Math.min(durationInSeconds * 3, 3000); // never longer than 3 seconds
  }

  function playCardAudio(audio: LazyAudio) {
    // component was unmounted
    if (!mountedRef.current) {
      return Promise.reject(`The audio wasn't played because the audio player was unmounted.`);
    }

    activeAudioRef.current = audio;
    return new Promise<void>((resolve, reject) => {
      audio.once('end', () => resolve());
      audio.once('loaderror', () => reject('unable to load audio'));
      audio.once('playerror', () => reject('unable to play audio'));
      audio.play();
    });
  }

  function wait(time: number) {
    activeAudioRef.current = undefined;
    return new Promise<undefined>((resolve) => {
      setTimer(() => resolve(undefined), time);
    });
  }
}
