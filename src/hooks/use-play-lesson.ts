import { useMemo, useRef, useState } from 'react';
import * as stringDistance from 'fast-levenshtein';
import correctSound from '@/assets/sounds/correct.mp3';
import incorrectSound from '@/assets/sounds/incorrect.wav';
import { compare, shuffle } from '@/helpers/sort';
import { replaceNonAlphanumeric, stringToBoolean } from '@/helpers/string';
import { toNumberOrElse } from '@/helpers/validator';
import { Card } from '@/models/card';
import { Deck } from '@/models/deck';
import { LazyAudio } from '@/models/lazy-audio';
import { createNewLessonCard, LessonCard, LessonCardContent } from '@/models/lesson-card';
import { StudyConfiguration } from '@/pages/_shared/study-config-popup/study-config-popup';
import { LocalStorageKeys as LSKeys } from '@/state/init';
import { SortRule } from '@/state/user-decks';
import { useLocalStorage } from './use-local-storage';
import { usePlayCardAudio } from './use-play-card-audio';
import { useSpacedRepetition } from './use-spaced-repetition';
import { useCaptureSpeech } from './use-speech-recognition';

const STRING_DISTANCE_THRESHOLD = 2;

interface UsePlayLessonSettings {
  deck: Deck;
  studyConfig: StudyConfiguration;
}

export function usePlayLesson({ deck, studyConfig }: UsePlayLessonSettings) {
  const _maxCards = studyConfig.maxCards ?? 5;
  const numCards = Math.min(_maxCards, deck.cards.length);

  // these hooks capture no state, only helpers (i.e. singleton)
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
    hasSpeechRecognitionObj,
    isCapturingSpeech,
  } = useCaptureSpeech();

  const { pauseAudio, resumeAudio, playAudio, clearAudio } = usePlayCardAudio();

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
    }
    // stops capture immediately and discards results
    else if (lifecycle === 'capture-speech') {
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
    }
    // resuming will progress the lesson as if you got the card wrong
    else if (lifecycle === 'capture-speech') {
      resumeSpeechResult();
    }
  }

  // forward button
  function skipCard() {
    clearAudio();
    _tryFlipToFront();

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
    _tryFlipToFront();

    const lifecycle = currentLifecycleRef.current;
    if (lifecycle === 'capture-speech') {
      stopCapturingSpeech();
    }

    // previous card may already have a result, and that's fine bc it'll be overridden if user gets it incorrect/correct again
    // if it becomes problematic (styling), we can override back to unseen and keep a record of prior answers for the card id
    const next = previousCard(currentCard, upcomingCards, completedCards);
    setCurrentCard(next.currentCard);

    if (!isPaused) {
      playCard(next.currentCard, next.upcomingCards, next.completedCards);
    }
  }

  // TODO: for future lesson types we would update the upcoming cards
  // to be pedantic, play a single lesson card (which includes front and back of card)
  async function playCard(
    currentCard: LessonCard,
    upcomingCards: LessonCard[],
    completedCards: LessonCard[]
  ) {
    if (completedCards.length === numCards) {
      return;
    }

    if (!currentCard.front.audio || !currentCard.back.audio) {
      throw new Error('card audio could not be found');
    }

    // active card key must be changed
    setActiveCard(currentCard.key);

    // play front
    currentLifecycleRef.current = 'front';
    setActiveCardSide('front');
    await playAudio(currentCard.front.customAudio ?? currentCard.front.audio, 1, {
      firstPlayPause: 500,
      lastPause: _shouldEnableSpeechRecognition() ? 0 : 2000, // maybe this can be configurable
    });

    const updatedCard = { ...currentCard };
    if (_shouldEnableSpeechRecognition()) {
      // capture spoken text using speech recognition
      currentLifecycleRef.current = 'capture-speech';
      const spokenText = await captureSpeech(
        currentCard.back.language,
        await _getSpeechMaxPauseLength(currentCard.back)
      );

      // grade spoken text with back text and play the outcome chime
      currentLifecycleRef.current = 'grading';
      const expectedText = replaceNonAlphanumeric(currentCard.back.text.trim().toLocaleLowerCase());
      const wasCorrect = _gradeSpokenText(spokenText, expectedText);

      if (_shouldPlaySoundEffects()) {
        const outcomeAudio = new LazyAudio(wasCorrect ? correctSound : incorrectSound);
        await playAudio(outcomeAudio);
      }

      // update 'updatedCard' outcome since it has been graded
      updatedCard.outcome = wasCorrect ? 'correct' : 'incorrect';
      console.log(currentCard.back.text, spokenText, `(was correct: ${wasCorrect})`);
    }

    // play back
    currentLifecycleRef.current = 'back';
    setActiveCardSide('back'); // flip to back
    setCurrentCard(updatedCard); // inform card outcome changed after flip (can be before, but looks better)
    await playAudio(currentCard.back.customAudio ?? currentCard.back.audio, 1, {
      firstPlayPause: 100,
      lastPause: 1000,
    });

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

  /**
   * Best-effort to grade spoken text using substring match with string similarity (levenshtein) thresholds.
   *
   * Given `expected` text of length N, scan the spoken text with a sliding window of length N.
   * If any text is within the string similarity threshold, then the spoken text was correct.
   */
  function _gradeSpokenText(spoken: string, expected: string): boolean {
    const spokenWords: string[] = spoken.split(' ');
    const expectedWords: string[] = expected.split(' ');

    const threshold = Math.min(expected.length - 1, STRING_DISTANCE_THRESHOLD);
    const windowSize = expectedWords.length;

    for (let i = 0; i < spokenWords.length; i++) {
      const spokenChunk = spokenWords.slice(i, i + windowSize);
      const spokenChunkText = spokenChunk.join(' ');

      // always use Intl.Collator for locale-sensitive string comparisons
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
      if (stringDistance.get(spokenChunkText, expected, { useCollator: true }) <= threshold) {
        return true;
      }
    }

    return false;
  }

  async function _getSpeechMaxPauseLength(backContent: LessonCardContent) {
    const attemptPauseLength = toNumberOrElse(ls.getString(LSKeys.attemptPauseLength), 0);

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

  function _shouldEnableSpeechRecognition() {
    return (
      hasSpeechRecognitionObj() &&
      stringToBoolean(ls.getString(LSKeys.enableSpeechRecognition), true)
    );
  }

  function _shouldPlaySoundEffects() {
    return stringToBoolean(ls.getString(LSKeys.enableSoundEffects), true);
  }

  // this is 99.99% not needed, but just in case some edge case occurs...
  function _tryFlipToFront() {
    if (activeCardKey && activeCardSide === 'back') {
      setActiveCardSide('front');
    }
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
