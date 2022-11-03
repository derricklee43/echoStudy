import { useEffect, useRef, useState } from 'react';
import correctSound from '@/assets/sounds/correct.wav';
import incorrectSound from '@/assets/sounds/incorrect.wav';
import { deferredPromise } from '@/helpers/promise';
import { stringToBoolean } from '@/helpers/string';
import { toNumberOrElse } from '@/helpers/validator';
import { CapturedSpeech } from '@/models/captured-speech';
import { LazyAudio } from '@/models/lazy-audio';
import { LessonCard, LessonCardContent } from '@/models/lesson-card';
import { LocalStorageKeys } from '@/state/init';
import { useLocalStorage } from './use-local-storage';
import { useMountedRef } from './use-mounted-ref';
import { useCaptureSpeech } from './use-speech-recognition';
import { useTimer } from './use-timer';

export function usePlayCardAudio() {
  const ls = useLocalStorage();

  // timer used to create wait periods between audios
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();
  const { captureSpeech, stopCapturingSpeech, abortSpeechCapture, isCapturingSpeech } =
    useCaptureSpeech();

  const activeAudioRef = useRef<LazyAudio>(); // if there isn't an active audio, we are at a 500ms wait
  const [activeCardKey, setActiveCard] = useState<string>('');
  const [activeCardSide, setActiveCardSide] = useState<'front' | 'back'>('front');

  const mountedRef = useMountedRef();
  useEffect(() => {
    return () => clearAudio();
  }, []);

  return {
    activeCardKey,
    activeCardSide,
    isCapturingSpeech,
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
      if (activeCardKey && activeCardSide === 'back') {
        setActiveCardSide('front');
      }
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

  // async function playAudio(lessonCard: LessonCard): Promise<LessonCard> {
  //   clearAudio();

  //   const frontAudio = lessonCard.front.audio;
  //   const backAudio = lessonCard.back.audio;

  //   if (frontAudio === undefined || backAudio === undefined) {
  //     throw new Error('card audio could not be found');
  //   }

  //   // grab player options before playing front
  //   const advanceOnlyOnAttempt = stringToBoolean(
  //     ls.getString(LocalStorageKeys.advanceOnlyOnAttempt)
  //   );
  //   const attemptPauseLength = toNumberOrElse(ls.getString(LocalStorageKeys.attemptPauseLength), 0);

  //   const maxPauseLength = await (async () => {
  //     if (attemptPauseLength > 0) {
  //       return attemptPauseLength * 1000;
  //     }
  //     // fallback or 'auto' is based off back audio duration
  //     else {
  //       const backDuration = await backAudio.durationAsync();
  //       return getPauseLength(backDuration);
  //     }
  //   })();

  //   // play front audio
  //   setActiveCard(lessonCard.key);
  //   setActiveCardSide('front');
  //   await wait(500);
  //   await playCardAudio(frontAudio);

  //   // get speech result
  //   const spokenText = await captureSpeech(lessonCard.back.language, maxPauseLength);

  //   // calculate outcome from spoken text and actual text
  //   const expectedText = lessonCard.back.text.trim().toLocaleLowerCase();
  //   const wasCorrect = spokenText.includes(expectedText);
  //   const outcome = wasCorrect ? 'correct' : 'incorrect';
  //   console.log(lessonCard.back.text, spokenText, `(was correct: ${wasCorrect}`);

  //   // play outcome chime
  //   const sound = wasCorrect ? correctSound : incorrectSound;
  //   const outcomeAudio = new LazyAudio(sound);
  //   await playCardAudio(outcomeAudio);

  //   // play back audio
  //   // TODO: most likely we will want to disable speech recognition if the repeat count is greater than 1
  //   setActiveCardSide('back');
  //   await repeatAudio(backAudio, lessonCard.repeatDefinitionCount);

  //   return { ...lessonCard, outcome };
  // }

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
