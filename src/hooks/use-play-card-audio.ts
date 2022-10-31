import { useEffect, useRef, useState } from 'react';
import correctSound from '@/assets/sounds/correct.wav';
import incorrectSound from '@/assets/sounds/incorrect.wav';
import { stringToBoolean } from '@/helpers/string';
import { isDefined, toNumberOrElse } from '@/helpers/validator';
import { CapturedSpeech } from '@/models/captured-speech';
import { LazyAudio } from '@/models/lazy-audio';
import { LessonCard } from '@/models/lesson-card';
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

  const activeAudioRef = useRef<LazyAudio>();
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
    stopCapturingSpeech();
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
    abortSpeechCapture();
    if (!activeAudioRef.current) {
      clearTimer();
      if (activeCardKey && activeCardSide === 'back') {
        setActiveCardSide('front');
      }
      return;
    }
    activeAudioRef.current.stop();
  }

  async function playAudio(lessonCard: LessonCard): Promise<LessonCard> {
    clearAudio();

    const frontAudio = lessonCard.front.audio;
    const backAudio = lessonCard.back.audio;

    if (frontAudio === undefined || backAudio === undefined) {
      throw new Error('card audio could not be found');
    }

    // grab player options before playing front
    const advanceOnlyOnAttempt = stringToBoolean(
      ls.getString(LocalStorageKeys.advanceOnlyOnAttempt)
    );
    const attemptPauseLength = toNumberOrElse(ls.getString(LocalStorageKeys.attemptPauseLength), 0);

    const maxPauseLength = await (async () => {
      if (attemptPauseLength > 0) {
        return attemptPauseLength * 1000;
      } else {
        const backDuration = await backAudio.durationAsync();
        return getPauseLength(backDuration);
      }
    })();

    // play front audio
    setActiveCard(lessonCard.key);
    setActiveCardSide('front');

    await wait(500);
    await playCardAudio(frontAudio);

    // Start capturing speech
    let remainingPauseLength = maxPauseLength;
    let retryCapture = true;
    let capturedSpeech: CapturedSpeech = { transcript: '', confidence: 0 };

    // workaround for speech recognition erroring if no response in ~10 seconds
    while (retryCapture) {
      try {
        // Currently if the user pauses while the recording is going, we will only get the results back before the pause.
        // I think this is reasonable for now, but we might want to come up with a better system in the future.

        // TODO: skipping doesnt work because cancelling wait should never yield...
        // ideas: maybe wait in increments and check after each?
        capturedSpeech =
          (await Promise.race([
            captureSpeech(lessonCard.back.language),
            wait(remainingPauseLength),
          ])) ?? capturedSpeech;
        retryCapture = false;
      } catch (error) {
        if (error !== 'no-speech') {
          retryCapture = false;
        } else {
          remainingPauseLength -= 10 * 1000;
        }
      }
    }

    // Stop capturing speech if not already ended
    if (!advanceOnlyOnAttempt) {
      stopCapturingSpeech();
    }

    if (isCapturingSpeech) {
      return Promise.reject('Another card was played, skipping current recording');
    }

    const expectedText = lessonCard.back.text.trim().toLocaleLowerCase();
    const actualText = capturedSpeech.transcript.trim().toLocaleLowerCase();
    const wasCorrect = expectedText === actualText;

    const outcome = wasCorrect ? 'correct' : 'incorrect';
    console.log(lessonCard.back.text, capturedSpeech.transcript, 'was correct: ' + wasCorrect);

    const sound = wasCorrect ? correctSound : incorrectSound;
    const outcomeAudio = new LazyAudio(sound);
    await playCardAudio(outcomeAudio);

    // play back audio
    setActiveCardSide('back');

    // TODO: most likely we will want to disable speech recognition if the repeat count is greater than 1
    await repeatAudio(backAudio, lessonCard.repeatDefinitionCount);

    return { ...lessonCard, outcome };
  }

  async function repeatAudio(audio: LazyAudio, times: number): Promise<void> {
    if (times === 0) return;

    await playCardAudio(audio);

    const duration = await audio.durationAsync();
    await wait(getPauseLength(duration));

    return repeatAudio(audio, times - 1);
  }

  function getPauseLength(audioDuration: number) {
    const durationInSeconds = audioDuration * 1000;
    return durationInSeconds * 3;
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
