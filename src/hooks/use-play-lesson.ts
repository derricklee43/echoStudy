import { useMemo, useRef, useState } from 'react';
import { compare, shuffle } from '@/helpers/sort';
import { Card } from '@/models/card';
import { Deck } from '@/models/deck';
import { createNewLessonCard, LessonCard } from '@/models/lesson-card';
import { StudyConfiguration } from '@/pages/_shared/study-config-popup/study-config-popup';
import { SortRule } from '@/state/user-decks';
import { usePlayCardAudio } from './use-play-card-audio';
import { useSpacedRepetition } from './use-spaced-repetition';

interface UsePlayLessonSettings {
  deck: Deck;
  studyConfig: StudyConfiguration;
}

export function usePlayLesson({ deck, studyConfig }: UsePlayLessonSettings) {
  const _maxCards = studyConfig.maxCards ?? 5;
  const numCards = Math.min(_maxCards, deck.cards.length);

  const spacedRepetition = useMemo(() => useSpacedRepetition(), []);

  const [firstCard, ...restCards] = getLessonCards(deck, studyConfig);
  const [currentCard, setCurrentCard] = useState<LessonCard>(firstCard);
  const [upcomingCards, setUpcomingCards] = useState(restCards);
  const [completedCards, setCompletedCards] = useState<LessonCard[]>([]);
  const [isPaused, setIsPaused] = useState(true);

  const currentLifecycleRef = useRef<'front' | 'speech' | 'back'>('front');

  const {
    pauseAudio,
    resumeAudio,
    playAudio,
    clearAudio,
    activeCardSide,
    activeCardKey,
    isCapturingSpeech,
  } = usePlayCardAudio();

  return {
    currentCard,
    activeCardSide,
    completedCards: [...completedCards],
    isCapturingSpeech,
    play: play,
    pause: pauseCard,
    skip: skipCard,
    replay: replayCard,
  };

  function play() {
    setIsPaused(false);
    if (currentCard.key === activeCardKey) {
      resumeAudio();
      return;
    }
    playCard(currentCard, upcomingCards, completedCards);
  }

  function skipCard() {
    clearAudio();
    const next = nextCard(currentCard, upcomingCards, completedCards);
    if (!isPaused && next) {
      playCard(next.currentCard, next.upcomingCards, next.completedCards);
    }
  }

  function replayCard() {
    // TODO: will want a stopwatch to both replay current card and play previous card
    clearAudio();
    const next = previousCard(currentCard, upcomingCards, completedCards);

    // undo the last result
    const updatedCard: LessonCard = { ...next.currentCard, outcome: 'unseen' };
    setCurrentCard(updatedCard);

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

    // TODO: for future lesson types we would update the upcoming cards
    const updatedCard = await playAudio(currentCard);
    setCurrentCard(updatedCard);

    // play front
    currentLifecycleRef.current = 'front';

    // speech recognition
    currentLifecycleRef.current = 'speech';

    // play back
    currentLifecycleRef.current = 'back';

    // play next card
    const next = nextCard(updatedCard, upcomingCards, completedCards);
    next && playCard(next.currentCard, next.upcomingCards, next.completedCards);
  }

  function nextCard(
    currentCard: LessonCard,
    upcomingCards: LessonCard[],
    completedCards: LessonCard[]
  ) {
    if (!upcomingCards[0] && completedCards.map((card) => card.key).includes(currentCard.key)) {
      return false;
    }

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

  // TODO: Add Filtering based in settings
  function getLessonCards(deck: Deck, studyConfig: StudyConfiguration): LessonCard[] {
    const cards =
      studyConfig.studyType === 'review'
        ? spacedRepetition.gatherStudyCards(deck, numCards)
        : _sortCardsByRule(deck.cards, studyConfig.order ?? 'random').slice(0, numCards);

    return cards.map((card) => createNewLessonCard(card, deck, 1));
  }

  function _sortCardsByRule(cards: Card[], sortRule: SortRule): Card[] {
    switch (sortRule) {
      case 'sequential':
        return cards.sort(); // natural ordering

      case 'last created':
        return cards.sort((a, b) => compare(b.dateCreated, a.dateCreated)); // descending

      case 'last updated':
        return cards.sort((a, b) => compare(b.dateUpdated, a.dateUpdated)); // descending

      case 'last studied':
        return cards.sort((a, b) => compare(b.dateTouched, a.dateTouched)); // descending

      case 'random':
        return shuffle(cards);
    }
  }
}
