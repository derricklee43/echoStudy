import React, { useEffect, useState } from 'react';
import { Card } from '../../models/card';
import { LazyAudio } from '../../models/lazy-audio';
import { Flashcard } from '../flashcard/flashcard';
import './read-only-flashcard-set.scss';

interface ReadOnlyFlashcardSetProps {
  className?: string;
  cards: Card[];
}

export const ReadOnlyFlashcardSet = ({ className = '', cards }: ReadOnlyFlashcardSetProps) => {
  const [playingAudioFile, setPlayingAudioFile] = useState<LazyAudio>();

  // stops audio on destroy
  useEffect(() => {
    return () => {
      playingAudioFile?.reset();
    };
  }, [playingAudioFile]);

  const flashcards = cards.map((card) => (
    <div key={card.key}>
      <Flashcard card={card} variant="readonly" onSpeakerClick={handleSpeakerClick} />
    </div>
  ));
  return <div className={`c-read-only-flashcard-set ${className}`}>{flashcards}</div>;

  function handleSpeakerClick(audioFile?: LazyAudio) {
    if (audioFile === undefined) {
      console.error('Audio file was undefined');
      return;
    }

    // stop any current playing audio
    playingAudioFile?.reset();

    // play the new one
    setPlayingAudioFile(audioFile);
    audioFile?.play();
  }
};
