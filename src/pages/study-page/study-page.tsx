import React, { useEffect, useRef, useState } from 'react';
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
  const [isPaused, setIsPaused] = useState(true);
  const { activeCard, activeCardSide, numRemainingCards, pause, play, skipCard, replayCard } =
    usePlayLesson({
      deck,
      lessonType: 'studyNew',
    });

  const initialCardCountRef = useRef(numRemainingCards);

  const percentComplete =
    ((initialCardCountRef.current - numRemainingCards) / initialCardCountRef.current) * 100;

  const showDeckCover = activeCard === undefined;
  return (
    <div className="study-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="Go back" />
      <div className="study-page-content">
        <StudyFlashcard
          id={showDeckCover ? 'deck-cover' : activeCard.key}
          variant={showDeckCover ? 'dark' : 'light'}
          frontContent={showDeckCover ? deck.metaData.title : activeCard.front.text}
          backContent={activeCard?.back.text}
          backLabel="definition"
          frontLabel={showDeckCover ? '' : 'term'}
          activeSide={activeCardSide}
        />
        <ProgressBar
          variant="white"
          percent={percentComplete}
          label=""
          className="study-page-progress-bar"
        />
        <AudioControlBar
          isPaused={isPaused}
          onNextClick={skipCard}
          onPlayClick={handlePlayClick}
          onPauseClick={handlePauseClick}
          onPreviousClick={replayCard}
        />
      </div>
    </div>
  );

  function handlePlayClick() {
    setIsPaused(false);
    play();
  }

  function handlePauseClick() {
    setIsPaused(true);
    pause();
  }
};
