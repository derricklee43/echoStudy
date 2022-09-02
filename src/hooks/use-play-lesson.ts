import { useRef } from 'react';
import { Card } from '../models/card';
import { Deck } from '../models/deck';
import { usePlayCardAudio } from './use-play-card-audio';

export function usePlayLesson() {
  const lessonCards = useRef<Card[]>([]);
  const [activeCardKey, activeText, playTermAndDefinition, pause, resume, getTotalCardDuration] =
    usePlayCardAudio();

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

  return [activeCardKey, activeText, startLesson, pauseLesson, resumeLesson] as const;
}

function buildLesson(deck: Deck) {
  return deck.cards.slice(0, 5);
}
