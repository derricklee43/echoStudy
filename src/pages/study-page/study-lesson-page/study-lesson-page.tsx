import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '../../../animations/fade';
import { MicrophoneIcon } from '../../../assets/icons/microphone-icon/microphone-icon';
import { AudioControlBar } from '../../../components/audio-control-bar/audio-control-bar';
import { PageHeader } from '../../../components/page-header/page-header';
import { ProgressBar } from '../../../components/progress-bar/progress-bar';
import { StudyFlashcard } from '../../../components/study-flashcard/study-flashcard';
import { noop } from '../../../helpers/func';
import { usePlayLesson } from '../../../hooks/use-play-lesson';
import { useStopWatch } from '../../../hooks/use-stop-watch';
import { Deck } from '../../../models/deck';
import { LessonCard } from '../../../models/lesson-card';
import './study-lesson-page.scss';

interface StudyPageLessonProps {
  deck: Deck;
  onLessonComplete: (lessonCards: LessonCard[], lessonTime: number) => void;
}

export const StudyLessonPage = ({ deck, onLessonComplete }: StudyPageLessonProps) => {
  const numCards = 4; // TODO: we will want to make this configurable or just pull in all past due cards
  const [isPaused, setIsPaused] = useState(true);
  const { startStopWatch, pauseStopWatch, getElapsedTime } = useStopWatch();
  const [hasLessonStarted, setHasLessonStarted] = useState(false);
  const {
    currentCardKey,
    activeCardSide,
    completedCards,
    isCapturingSpeech,
    pause,
    play,
    skip,
    replay,
  } = usePlayLesson({
    deck,
    lessonType: 'studyNew',
    numCards,
  });
  const percentComplete = (completedCards.length / numCards) * 100;

  const showCover = !hasLessonStarted;
  const currentCard = getCurrentCard();

  return (
    <div className="study-lesson-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="Go back" />
      <div className="study-lesson-page-content">
        <div className="study-flashcard-container">
          <div className="pulsing-microphone-container">
            <AnimatePresence>
              {isCapturingSpeech && (
                <Fade fadeIn={true}>
                  <div className="pulsing-microphone">
                    <MicrophoneIcon />
                  </div>
                </Fade>
              )}
            </AnimatePresence>
          </div>
          {showCover ? getCover() : getCard()}
          <ProgressBar
            variant="white"
            percent={percentComplete}
            label=""
            className="study-page-progress-bar"
            onAnimationComplete={handleProgressBarAnimationCompletion}
          />
        </div>
        <AudioControlBar
          isPaused={isPaused}
          onNextClick={handleNextClick}
          onPlayClick={handlePlayClick}
          onPauseClick={handlePauseClick}
          onPreviousClick={handleReplayClick}
        />
      </div>
    </div>
  );

  function getCover() {
    return (
      <StudyFlashcard
        id="cover"
        variant="dark"
        frontContent={deck.metaData.title}
        backContent=""
        backLabel=""
        frontLabel=""
        activeSide="front"
      />
    );
  }

  function getCard() {
    return (
      <StudyFlashcard
        id={currentCard.key}
        variant="light"
        frontContent={currentCard.front.text}
        backContent={currentCard?.back.text}
        backLabel="definition"
        frontLabel="term"
        activeSide={activeCardSide}
      />
    );
  }

  function handleReplayClick() {
    if (!hasLessonStarted) {
      return setHasLessonStarted(true);
    }
    replay();
  }

  function handleNextClick() {
    if (!hasLessonStarted) {
      return setHasLessonStarted(true);
    }
    skip();
  }

  function handlePlayClick() {
    setHasLessonStarted(true);
    startStopWatch();
    setIsPaused(false);
    play();
  }

  function handlePauseClick() {
    setIsPaused(true);
    pauseStopWatch();
    pause();
  }

  function getCurrentCard() {
    const currentCard = deck.cards.find((c) => c.key === currentCardKey);
    if (currentCard === undefined) {
      throw Error(`deck does not contain card with key: ${currentCardKey}`);
    }
    return currentCard;
  }

  function handleProgressBarAnimationCompletion() {
    if (isLessonComplete()) {
      const lessonCards = completedCards.reverse();
      const lessonTime = getElapsedTime();
      onLessonComplete(lessonCards, lessonTime);
    }
  }

  function isLessonComplete() {
    return numCards === completedCards.length;
  }
};
