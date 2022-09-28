import { useEffect, useRef, useState } from 'react';
import { useCaptureSpeech } from './use-speech-recognition';
import { useTimer } from './use-timer';
import correctSound from '../assets/sounds/correct.wav';
import incorrectSound from '../assets/sounds/incorrect.wav';
import { LazyAudio } from '../models/lazy-audio';
import { LessonCard } from '../models/lesson-card';

export function usePlayCardAudio() {
  // timer used to create wait periods between audios
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();
  const { captureSpeech, stopCapturingSpeech, abortSpeechCapture, isCapturingSpeech } =
    useCaptureSpeech();

  const activeAudioRef = useRef<LazyAudio>();
  const [activeCardKey, setActiveCard] = useState<string>('');
  const [activeCardSide, setActiveCardSide] = useState<'front' | 'back'>('front');

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
    activeAudioRef.current.reset();
  }

  async function playAudio(lessonCard: LessonCard): Promise<LessonCard> {
    clearAudio();
    const frontAudio = lessonCard.front.audio;
    const backAudio = lessonCard.back.audio;

    if (frontAudio === undefined || backAudio === undefined) {
      throw new Error('card audio could not be found');
    }

    // play front audio
    setActiveCard(lessonCard.key);
    setActiveCardSide('front');

    await wait(500);
    await playCardAudio(frontAudio);

    // Start capturing speech
    const capturedSpeechPromise = captureSpeech(lessonCard.back.language);

    // wait before flip
    const backDuration = await backAudio.getDuration();
    await wait(getPauseLength(backDuration));

    // Stop capturing speech if not already ended
    stopCapturingSpeech();

    // Currently if the user pauses while the recording is going, we will only get the results back before the pause.
    // I think this is reasonable for now, but we might want to come up with a better system in the future.
    const capturedSpeech = await capturedSpeechPromise;
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

    const duration = await audio.getDuration();
    await wait(getPauseLength(duration));

    return repeatAudio(audio, times - 1);
  }

  function getPauseLength(audioDuration: number) {
    const durationInSeconds = audioDuration * 1000;
    return durationInSeconds * 3;
  }

  function playCardAudio(audio: LazyAudio) {
    activeAudioRef.current = audio;
    return new Promise<void>((resolve, reject) => {
      audio.addEventListener('ended', () => resolve(), { once: true });
      audio.addEventListener('error', () => reject('unable to play audio'), { once: true });
      audio.play();
    });
  }

  function wait(time: number) {
    activeAudioRef.current = undefined;
    return new Promise<void>((resolve) => {
      setTimer(() => resolve(), time);
    });
  }
}
