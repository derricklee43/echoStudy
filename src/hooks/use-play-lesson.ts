import { useEffect, useRef, useState } from 'react';
import { useLessonOrder } from './use-lesson-order';
import { usePlayCardAudio } from './use-play-card-audio';
import { useTimer } from './use-timer';
import { pop, push } from '../helpers/func';
import { Card } from '../models/card';
import { Deck } from '../models/deck';
import { createNewLessonCard, LessonCard } from '../models/lesson-card';

type lessonType = 'review' | 'studyNew' | 'spacedRepetition';
interface UsePlayLessonSettings {
  deck: Deck;
  lessonType: lessonType;
  // TODO: This needs to be solidified
  // Do we want to lean hard into spaced repetition and take control away?
  // Or we want to give the user the freedom to study as they like?
}

export function usePlayLesson({ deck }: UsePlayLessonSettings) {
  const { currentCard, upcomingCards, seenCards, previousCard, nextCard } = useLessonOrder(deck);
  const [isPaused, setIsPaused] = useState(true);
  const { pause, resume, playTermAndDefinition, clearAudio, activeCardSide, activeCard } =
    usePlayCardAudio();

  useEffect(() => {
    if (!isPaused) {
      playCard();
    }
  }, [currentCard, isPaused]);

  useEffect(() => {
    console.log('current Card changed');
  }, [currentCard]);

  useEffect(() => {
    console.log('is paused changed');
  }, [isPaused]);

  return {
    activeCardSide,
    activeCard: currentCard.card,
    numRemainingCards: upcomingCards.length,
    play,
    pause: pauseCard,
    skipCard,
    replayCard,
  };

  function play() {
    setIsPaused(false);
  }

  function skipCard() {
    clearAudio();
    nextCard({ ...currentCard });
  }

  function replayCard() {
    clearAudio();
    previousCard();
  }

  function pauseCard() {
    setIsPaused(true);
    pause();
  }

  async function playCard() {
    if (currentCard.card.key === activeCard?.key) {
      return resume();
    }

    // TODO: change outcome to lesson card
    const outcome = await playTermAndDefinition(currentCard);
    // TODO: for future lesson types we would update the upcoming cards
    nextCard({ ...currentCard, outcome });
  }
}
