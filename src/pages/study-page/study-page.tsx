import React, { useEffect, useState } from 'react';
import { AudioControlBar } from '../../components/audio-control-bar/audio-control-bar';
import { LoadingPage } from '../../components/loading-page/loading-page';
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
  const { activeCardKey, activeCardSide, startLesson, pauseLesson, resumeLesson } = usePlayLesson();
  const [count, setCount] = useState(-2);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    setCount(count + 1); // TODO: Dummy incrementor. Replace with actual progress system
  }, [activeCardKey]);

  if (deck === undefined) {
    return <LoadingPage label="loading deck..." />;
  }

  const currentCard = findCard(activeCardKey);

  return (
    <div className="study-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="Go back" />
      <div className="study-page-content">
        <StudyFlashcard
          id={currentCard?.key ?? 'deck-cover'}
          variant={activeCardKey === '' ? 'dark' : 'light'}
          frontContent={currentCard?.front.text ?? deck.metaData.title}
          backContent={currentCard?.back.text}
          backLabel="definition"
          frontLabel={activeCardKey ? 'term' : ''}
          activeSide={activeCardSide}
        />
        <ProgressBar
          variant="white"
          percent={(count / 10) * 100}
          label=""
          className="study-page-progress-bar"
        />
        <AudioControlBar
          isPaused={isPaused}
          onNextClick={noop} // TODO: Add next card feature
          onPlayClick={handlePlayClick}
          onPauseClick={handlePauseClick}
          onPreviousClick={noop} // TODO: Add previous card feature
        />
      </div>
    </div>
  );

  function findCard(key: string) {
    return deck?.cards.find((card) => card.key === key);
  }

  function handlePlayClick() {
    if (deck === undefined) {
      return;
    }
    setIsPaused(false);
    if (activeCardKey === '') {
      return startLesson(deck);
    }
    resumeLesson();
  }

  function handlePauseClick() {
    setIsPaused(true);
    pauseLesson();
  }
};
