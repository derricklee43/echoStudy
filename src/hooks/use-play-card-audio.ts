import { useEffect, useRef, useState } from 'react';
import { useTimer } from './use-timer';
import { Card } from '../models/card';
import { LazyAudio } from '../models/lazy-audio';

export function usePlayCardAudio() {
  // timer used to create wait periods between audios
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();

  const activeAudioRef = useRef<LazyAudio>();
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
    if (!activeAudioRef.current) {
      pauseTimer();
      return;
    }
    activeAudioRef.current.pause();
  }

  function resume() {
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

  async function getTotalCardDuration(card: Card, repeatDefCount: number) {
    const frontAudioDuration = (await card.front.audio?.getDuration()) ?? 0;
    const backAudioDuration = (await card.back.audio?.getDuration()) ?? 0;
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

    // play front audio
    setActiveCardKey(card.key);
    setActiveCardSide('front');
    await playAudio(frontAudio);

    // wait before flip
    const backDuration = await backAudio.getDuration();
    await wait(getPauseLength(backDuration));

    // play back audio
    setActiveCardSide('back');
    await repeatAudio(backAudio, repeatDefCount);
  }

  async function repeatAudio(audio: LazyAudio, times: number): Promise<void> {
    if (times === 0) return;

    await playAudio(audio);

    const duration = await audio.getDuration();
    await wait(getPauseLength(duration));

    return repeatAudio(audio, times - 1);
  }

  function getPauseLength(audioDuration: number) {
    const durationInSeconds = audioDuration * 1000;
    return durationInSeconds * 2;
  }

  function playAudio(audio: LazyAudio) {
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
