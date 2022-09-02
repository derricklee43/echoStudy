import { useState } from 'react';
import { useTimer } from './use-timer';
import { Card } from '../models/card';

export function usePlayCardAudio() {
  const { setTimer, clearTimer, pauseTimer, resumeTimer } = useTimer();
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement>();
  const [activeCardKey, setActiveCardKey] = useState('');
  const [activeCardSide, setActiveCardSide] = useState<'front' | 'back'>('front');

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
    activeAudio?.pause();
  }

  function resume() {
    if (activeAudio === undefined) {
      return resumeTimer();
    }
    activeAudio.play();
  }

  function clearAudio() {
    activeAudio?.pause();
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

  function playTermAndDefinition(card: Card, repeatDefCount: number) {
    return new Promise((resolve, reject) => {
      try {
        clearAudio();
        const frontAudio = card.front.audio;
        const backAudio = card.back.audio;

        if (frontAudio === undefined || backAudio === undefined) {
          throw new Error('card audio could not be found');
        }

        const repeatAudioCallback = () => {
          setActiveCardSide('back');
          repeatAudio(backAudio, repeatDefCount, resolve as () => void);
        };
        const pauseLength = getPauseLength(backAudio.duration);
        chainToAudioWithPause(repeatAudioCallback, frontAudio, pauseLength);

        setActiveCardKey(card.key);
        setActiveCardSide('front');
        playAudio(frontAudio);
      } catch (e) {
        reject(e);
      }
    });
  }

  function repeatAudio(audio: HTMLAudioElement, times: number, callBack: () => void) {
    if (times === 0) return callBack();

    const repeatCardCallback = () => repeatAudio(audio, times - 1, callBack);
    const pauseLength = getPauseLength(audio.duration);
    chainToAudioWithPause(repeatCardCallback, audio, pauseLength);

    playAudio(audio);
  }

  function chainToAudioWithPause(
    callBack: () => void,
    audio: HTMLAudioElement,
    pauseLength: number
  ) {
    chainToAudio(() => setTimer(() => callBack(), pauseLength), audio);
  }

  function chainToAudio(callBack: () => void, audio: HTMLAudioElement) {
    audio.addEventListener('ended', callBack, { once: true });
  }

  function getPauseLength(audioDuration: number) {
    const durationInSeconds = audioDuration * 1000;
    return durationInSeconds * 2;
  }

  function playAudio(audio: HTMLAudioElement) {
    setActiveAudio(audio);
    chainToAudio(() => setActiveAudio(undefined), audio);
    audio.play();
  }
}
