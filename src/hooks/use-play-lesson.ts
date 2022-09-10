import { useState } from 'react';
import { usePlayCardAudio } from './use-play-card-audio';
import { Deck } from '../models/deck';
import { createNewLessonCard, LessonCard } from '../models/lesson-card';

// TODO: Add other lesson types
type lessonType = 'review' | 'studyNew' | 'spacedRepetition';
interface UsePlayLessonSettings {
  deck: Deck;
  numCards: number;
  lessonType: lessonType;
}

export function usePlayLesson({ deck, numCards }: UsePlayLessonSettings) {
  const [firstCard, ...restCards] = getLessonCards(deck, numCards);
  const [currentCard, setCurrentCard] = useState<LessonCard>(firstCard);
  const [upcomingCards, setUpcomingCards] = useState(restCards);
  const [completedCards, setCompletedCards] = useState<LessonCard[]>([]);
  const [isPaused, setIsPaused] = useState(true);
  const { pauseAudio, resumeAudio, playAudio, clearAudio, activeCardSide, activeCard } =
    usePlayCardAudio();

  return {
    currentCard: currentCard?.card,
    activeCardSide,
    completedCards: [...completedCards],
    play: play,
    pause: pauseCard,
    skip: skipCard,
    replay: replayCard,
  };

  function play() {
    setIsPaused(false);
    playCard(currentCard, upcomingCards, completedCards);
  }

  function skipCard() {
    clearAudio();
    const next = nextCard(currentCard, upcomingCards, completedCards);
    if (!isPaused) {
      playCard(next.currentCard, next.upcomingCards, next.completedCards);
    }
  }

  function replayCard() {
    // TODO: will want a stopwatch to both replay current card and play previous card
    clearAudio();
    const next = previousCard(currentCard, upcomingCards, completedCards);
    if (!isPaused) {
      playCard(next.currentCard, next.upcomingCards, next.completedCards);
    }
  }

  function pauseCard() {
    setIsPaused(true);
    pauseAudio();
  }

  async function playCard(
    currentCard: LessonCard,
    upcomingCards: LessonCard[],
    completedCards: LessonCard[]
  ) {
    if (completedCards.length === numCards) {
      return;
    }
    if (currentCard.card.key === activeCard?.key) {
      return resumeAudio();
    }

    // TODO: for future lesson types we would update the upcoming cards
    const updatedCard = await playAudio(currentCard);
    const next = nextCard(updatedCard, upcomingCards, completedCards);

    playCard(next.currentCard, next.upcomingCards, next.completedCards);
  }

  function nextCard(
    currentCard: LessonCard,
    upcomingCards: LessonCard[],
    completedCards: LessonCard[]
  ) {
    const newCompletedCards = [currentCard, ...completedCards];
    const newCurrentCard: LessonCard = upcomingCards[0] ?? currentCard;
    const newUpcomingCards = upcomingCards.slice(1);
    setCurrentCard(newCurrentCard);
    setCompletedCards(newCompletedCards);
    setUpcomingCards(newUpcomingCards);
    return {
      currentCard: newCurrentCard,
      completedCards: newCompletedCards,
      upcomingCards: newUpcomingCards,
    };
  }

  function previousCard(
    currentCard: LessonCard,
    upcomingCards: LessonCard[],
    completedCards: LessonCard[]
  ) {
    if (completedCards.length === 0) {
      return { currentCard, upcomingCards, completedCards };
    }
    const newUpcomingCards = [currentCard, ...upcomingCards];
    const newCurrentCard = completedCards[0];
    const newCompletedCards = completedCards.slice(1);
    setCurrentCard(newCurrentCard);
    setCompletedCards(newCompletedCards);
    setUpcomingCards(newUpcomingCards);

    return {
      currentCard: newCurrentCard,
      completedCards: newCompletedCards,
      upcomingCards: newUpcomingCards,
    };
  }
}

// TODO: Add Sorting and Filtering based in settings
function getLessonCards(deck: Deck, numCards: number): LessonCard[] {
  if (deck.cards.length < numCards) {
    throw Error('deck not contain enough cards specified in the lesson');
  }
  const cards = deck.cards.slice(0, numCards);
  return cards.map((card) => createNewLessonCard(card, 1));
}
