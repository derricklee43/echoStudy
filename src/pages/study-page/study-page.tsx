import React from 'react';
import { Button } from '../../components/button/button';
import { PageHeader } from '../../components/page-header/page-header';
import { noop } from '../../helpers/func';
import { usePlayLesson } from '../../hooks/use-play-lesson';
import { Deck } from '../../models/deck';
import './study-page.scss';

interface StudyPageProps {
  deck: Deck;
}

export const StudyPage = ({ deck }: StudyPageProps) => {
  const { activeCardKey, activeCardSide, startLesson, pauseLesson, resumeLesson } = usePlayLesson();

  return (
    <div className="study-page">
      <PageHeader label={deck.metaData.title} onGoBackClick={noop} goBackLabel="go back" />
      <br></br>
      <Button onClick={playAudio} size="medium">
        play audio
      </Button>
      <Button onClick={noop} size="medium">
        {activeCardKey}
      </Button>
      <Button onClick={noop} size="medium">
        {activeCardSide}
      </Button>
      <Button onClick={pauseLesson} size="medium">
        pause
      </Button>
      <Button onClick={resumeLesson} size="medium">
        resume
      </Button>
    </div>
  );

  function playAudio() {
    if (deck !== undefined) startLesson(deck);
  }
};
