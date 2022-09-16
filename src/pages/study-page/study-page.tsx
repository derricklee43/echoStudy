import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '../../animations/fade';
import { MicrophoneIcon } from '../../assets/icons/microphone-icon/microphone-icon';
import { AudioControlBar } from '../../components/audio-control-bar/audio-control-bar';
import { PageHeader } from '../../components/page-header/page-header';
import { ProgressBar } from '../../components/progress-bar/progress-bar';
import { StudyFlashcard } from '../../components/study-flashcard/study-flashcard';
import { noop } from '../../helpers/func';
import { usePlayLesson } from '../../hooks/use-play-lesson';
import { Deck } from '../../models/deck';
import './study-page.scss';

interface StudyPageProps {
  deck: Deck;
}

export const StudyPage = ({ deck }: StudyPageProps) => {
  const numCards = 4;

  const [isPaused, setIsPaused] = useState(true);
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
  const isLessonComplete = numCards === completedCards.length;
  const showCover = !hasLessonStarted || numCards === completedCards.length || !currentCardKey;
  const currentCard = getCurrentCard();

  return (
    <div className="study-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="Go back" />

      <div className="study-page-content">
        <div>
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
          />
        </div>
        {!isLessonComplete && (
          <AudioControlBar
            isPaused={isPaused}
            onNextClick={handleNextClick}
            onPlayClick={handlePlayClick}
            onPauseClick={handlePauseClick}
            onPreviousClick={handleReplayClick}
          />
        )}
      </div>
    </div>
  );

  function getCover() {
    const content = isLessonComplete ? 'Lesson Complete' : deck.metaData.title;
    return (
      <StudyFlashcard
        id="cover"
        variant="dark"
        frontContent={content}
        backContent=""
        backLabel=""
        frontLabel=""
        activeSide="front"
      />
    );
  }

  function getCard() {
    if (currentCardKey === undefined) return undefined;
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
    setIsPaused(false);
    play();
  }

  function handlePauseClick() {
    setIsPaused(true);
    pause();
  }

  function getCurrentCard() {
    const currentCard = deck.cards.find((c) => c.key === currentCardKey);
    if (currentCard === undefined) {
      throw Error(`deck does not contain card with key: ${currentCardKey}`);
    }
    return currentCard;
  }
};
