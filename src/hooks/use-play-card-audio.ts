import { useEffect, useRef, useState } from 'react';
import { useTimer } from './use-timer';
import { Card } from '../models/card';

export function usePlayCardAudio() {
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();
  const activeAudioRef = useRef<HTMLAudioElement>();
  const [activeCardKey, setActiveCardKey] = useState('');
  const [activeCardSide, setActiveCardSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    return () => clearAudio();
  }, []);

  return {
    activeCardKey,
    activeCardSide,
    playTermAndDefinition,
    pause,
    resume,
    getTotalCardDuration,
  };

  function pause() {
    pauseTimer();
    activeAudioRef.current?.pause();
  }

  function resume() {
    if (activeAudioRef.current === undefined) {
      return resumeTimer();
    }
    activeAudioRef.current.play();
  }

  function clearAudio() {
    activeAudioRef.current?.pause();
    clearTimer();
  }

  function getTotalCardDuration(card: Card, repeatDefCount: number) {
    const frontAudioDuration = card.front.audio?.duration ?? 0;
    const backAudioDuration = card.back.audio?.duration ?? 0;
    const pauseDuration = getPauseLength(backAudioDuration);

    const totalBackAudioDuration = backAudioDuration * repeatDefCount;
    const totalPauseDuration = pauseDuration * (repeatDefCount + 1);
    return frontAudioDuration + totalBackAudioDuration + totalPauseDuration;
  }

  async function playTermAndDefinition(card: Card, repeatDefCount: number) {
    clearAudio();
    const frontAudio = card.front.audio;
    const backAudio = card.back.audio;

    if (frontAudio === undefined || backAudio === undefined) {
      throw new Error('card audio could not be found');
    }

    setActiveCardKey(card.key);
    setActiveCardSide('front');

    await playAudio(frontAudio);
    await wait(getPauseLength(backAudio.duration));
    setActiveCardSide('back');
    await repeatAudio(backAudio, repeatDefCount);
  }

  async function repeatAudio(audio: HTMLAudioElement, times: number): Promise<void> {
    if (times === 0) return;

    await playAudio(audio);
    await wait(getPauseLength(audio.duration));
    return repeatAudio(audio, times - 1);
  }

  function getPauseLength(audioDuration: number) {
    const durationInSeconds = audioDuration * 1000;
    return durationInSeconds * 2;
  }

  function playAudio(audio: HTMLAudioElement) {
    activeAudioRef.current = audio;
    return new Promise<void>((resolve, reject) => {
      audio.addEventListener('ended', () => resolve(), { once: true });
      audio.addEventListener('error', () => reject('unable to play audio'), { once: true });
      audio.play();
    });
  }

  function wait(time: number) {
    return new Promise<void>((resolve) => {
      setTimer(() => resolve(), time);
    });
  }
}
