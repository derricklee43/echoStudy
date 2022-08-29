import { useRef } from 'react';
import { usePlayCardAudio } from './use-play-card-audio';
import { Card } from '../models/card';
import { Deck } from '../models/deck';

export function usePlayLesson() {
  const lessonCards = useRef<Card[]>([]);
  const {
    activeCardKey,
    activeCardSide,
    playTermAndDefinition,
    pause,
    resume,
    getTotalCardDuration,
  } = usePlayCardAudio();

  return { activeCardKey, activeCardSide, startLesson, pauseLesson, resumeLesson };

  function startLesson(deck: Deck) {
    lessonCards.current = buildLesson(deck);
    playNextCard();
  }

  async function playNextCard() {
    if (lessonCards.current.length === 0) {
      return;
    }
    const currentCard = lessonCards.current[0];
    lessonCards.current = lessonCards.current.slice(1);

    await playTermAndDefinition(currentCard, 1);
    playNextCard();
  }

  function pauseLesson() {
    pause();
  }

  function resumeLesson() {
    resume();
  }
}

function buildLesson(deck: Deck) {
  return deck.cards.slice(0, 4);
}
