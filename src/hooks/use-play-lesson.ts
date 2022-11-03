import { useMemo, useRef, useState } from 'react';
import correctSound from '@/assets/sounds/correct.wav';
import incorrectSound from '@/assets/sounds/incorrect.wav';
import { compare, shuffle } from '@/helpers/sort';
import { toNumberOrElse } from '@/helpers/validator';
import { Card } from '@/models/card';
import { Deck } from '@/models/deck';
import { LazyAudio } from '@/models/lazy-audio';
import {
  createNewLessonCard,
  LessonCard,
  LessonCardContent,
  LessonCardOutcome,
} from '@/models/lesson-card';
import { StudyConfiguration } from '@/pages/_shared/study-config-popup/study-config-popup';
import { LocalStorageKeys } from '@/state/init';
import { SortRule } from '@/state/user-decks';
import { useLocalStorage } from './use-local-storage';
import { usePlayCardAudio } from './use-play-card-audio';
import { useSpacedRepetition } from './use-spaced-repetition';
import { useCaptureSpeech } from './use-speech-recognition';

interface UsePlayLessonSettings {
  deck: Deck;
  studyConfig: StudyConfiguration;
}

export function usePlayLesson({ deck, studyConfig }: UsePlayLessonSettings) {
  const _maxCards = studyConfig.maxCards ?? 5;
  const numCards = Math.min(_maxCards, deck.cards.length);

  const ls = useMemo(() => useLocalStorage(), []);
  const spacedRepetition = useMemo(() => useSpacedRepetition(), []);

  // lesson card store state
  const [firstCard, ...restCards] = getLessonCards(deck, studyConfig);
  const [currentCard, setCurrentCard] = useState<LessonCard>(firstCard);
  const [upcomingCards, setUpcomingCards] = useState(restCards);
  const [completedCards, setCompletedCards] = useState<LessonCard[]>([]);

  // lesson lifecycle states
  const currentLifecycleRef = useRef<'front' | 'capture-speech' | 'grading' | 'back'>('front');
  const [activeCardKey, setActiveCard] = useState<string>('');
  const [activeCardSide, setActiveCardSide] = useState<'front' | 'back'>('front');
  const [isPaused, setIsPaused] = useState(true);

  const {
    captureSpeech,
    stopCapturingSpeech,
    abortSpeechCapture,
    resumeSpeechResult,
    isCapturingSpeech,
    hasBrowserSupport,
  } = useCaptureSpeech();

  const {
    pauseAudio,
    resumeAudio,
    playAudio,
    clearAudio,
    // activeCardSide,
    // activeCardKey,
    // isCapturingSpeech,
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

  // pause button
  function pauseCard() {
    setIsPaused(true);

    const lifecycle = currentLifecycleRef.current;
    if (['front', 'back'].includes(lifecycle)) {
      pauseAudio();
    } else if (lifecycle === 'capture-speech') {
      abortSpeechCapture();
    }
  }

  // play or resume button
  function play() {
    setIsPaused(false);

    const lifecycle = currentLifecycleRef.current;
    if (['front', 'back'].includes(lifecycle)) {
      if (currentCard.key === activeCardKey) {
        resumeAudio();
        return;
      }
      playCard(currentCard, upcomingCards, completedCards);
    } else if (lifecycle === 'capture-speech') {
      resumeSpeechResult();
    }
  }

  // forward button
  function skipCard() {
    clearAudio();

    const lifecycle = currentLifecycleRef.current;
    if (lifecycle === 'capture-speech') {
      stopCapturingSpeech();
    }

    const next = nextCard(currentCard, upcomingCards, completedCards);
    if (!isPaused && next) {
      playCard(next.currentCard, next.upcomingCards, next.completedCards);
    }
  }

  // previous button
  function replayCard() {
    // TODO: will want a stopwatch to both replay current card and play previous card
    clearAudio();

    const lifecycle = currentLifecycleRef.current;
    if (lifecycle === 'capture-speech') {
      stopCapturingSpeech();
    }

    // TODO: although we change it back to unseen, can we have a record (map) of if it was previously correct?
    // undo the last result
    const next = previousCard(currentCard, upcomingCards, completedCards);
    const updatedCard: LessonCard = { ...next.currentCard, outcome: 'unseen' };
    setCurrentCard(updatedCard);

    if (!isPaused) {
      playCard(next.currentCard, next.upcomingCards, next.completedCards);
    }
  }

  // to be pedantic, play a single lesson card (which includes front and back of card)
  async function playCard(
    currentCard: LessonCard,
    upcomingCards: LessonCard[],
    completedCards: LessonCard[]
  ) {
    if (completedCards.length === numCards) {
      return;
    }

    // TODO: for future lesson types we would update the upcoming cards

    if (!currentCard.front.audio || !currentCard.back.audio) {
      throw new Error('card audio could not be found');
    }

    // active card key must be changed
    setActiveCard(currentCard.key);

    // play front
    currentLifecycleRef.current = 'front';
    setActiveCardSide('front');
    await playAudio(currentCard.front.audio, 1, { firstPlayPause: 500 });

    // capture spoken text using speech recognition
    currentLifecycleRef.current = 'capture-speech';
    const spokenText = await captureSpeech(
      currentCard.back.language,
      await _getSpeechMaxPauseLength(currentCard.back)
    );

    // grade spoken text with back text and play the outcome chime
    currentLifecycleRef.current = 'grading';
    const expectedText = currentCard.back.text.trim().toLocaleLowerCase();
    const wasCorrect = spokenText.includes(expectedText);
    const outcomeAudio = new LazyAudio(wasCorrect ? correctSound : incorrectSound);
    await playAudio(outcomeAudio);
    console.log(currentCard.back.text, spokenText, `(was correct: ${wasCorrect}`);

    // create updated card instance since outcome changed
    const outcome: LessonCardOutcome = wasCorrect ? 'correct' : 'incorrect';
    const updatedCard = { ...currentCard, outcome };

    // play back
    currentLifecycleRef.current = 'back';
    setActiveCardSide('back'); // flip to back
    setCurrentCard(updatedCard); // inform card outcome changed after flip (can be before, but looks better)
    await playAudio(currentCard.back.audio, 1, { firstPlayPause: 100, lastPause: 1000 });

    // queue and play next card (if one exists)
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

  async function _getSpeechMaxPauseLength(backContent: LessonCardContent) {
    const attemptPauseLength = toNumberOrElse(ls.getString(LocalStorageKeys.attemptPauseLength), 0);

    const maxPauseLength = await (async () => {
      if (attemptPauseLength > 0) {
        return attemptPauseLength * 1000;
      }
      // fallback or 'auto' is based off 2.5x back audio duration
      else {
        const backDuration = await backContent.audio?.durationAsync();
        if (!backDuration) {
          throw new Error(
            `Lesson card back audio should not be undefined! Back text was ${backContent.text} `
          );
        }
        return backDuration * 1000 * 2.5;
      }
    })();

    return maxPauseLength;
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
