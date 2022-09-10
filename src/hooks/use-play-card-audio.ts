import { useEffect, useRef, useState } from 'react';
import { useTimer } from './use-timer';
import { Card } from '../models/card';
import { LazyAudio } from '../models/lazy-audio';
import { LessonCard, LessonCardOutcome } from '../models/lesson-card';

export function usePlayCardAudio() {
  // timer used to create wait periods between audios
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();

  const activeAudioRef = useRef<LazyAudio>();
  const [activeCard, setActiveCard] = useState<Card>();
  const [activeCardSide, setActiveCardSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    return () => clearAudio();
  }, []);

  return {
    activeCard,
    activeCardSide,
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
    activeAudioRef.current.reset();
  }

  async function playAudio(lessonCard: LessonCard): Promise<LessonCard> {
    clearAudio();
    const frontAudio = lessonCard.card.front.audio;
    const backAudio = lessonCard.card.back.audio;

    if (frontAudio === undefined || backAudio === undefined) {
      throw new Error('card audio could not be found');
    }

    // play front audio
    setActiveCard(lessonCard.card);
    setActiveCardSide('front');
    await playCardAudio(frontAudio);

    // wait before flip
    const backDuration = await backAudio.getDuration();
    await wait(getPauseLength(backDuration));

    // play back audio
    setActiveCardSide('back');
    await repeatAudio(backAudio, lessonCard.repeatDefinitionCount);
    return { ...lessonCard, outcome: 'correct' };
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
    return durationInSeconds * 2;
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
