import { useEffect, useState } from 'react';
import { LazyAudio } from '@/models/lazy-audio';

export function useLazyAudioPlayer() {
  const [playingAudioFile, setPlayingAudioFile] = useState<LazyAudio>();
  // stops audio on destroy
  useEffect(() => {
    return () => {
      playingAudioFile?.stop();
    };
  }, [playingAudioFile]);

  return { playLazyAudio };

  function playLazyAudio(audioFile?: LazyAudio) {
    if (audioFile === undefined) {
      console.error('Audio file was undefined');
      return;
    }

    // stop any current playing audio
    playingAudioFile?.stop();

    // play the new one
    setPlayingAudioFile(audioFile);
    audioFile?.play();
  }
}
