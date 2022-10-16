import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpToggle } from '@/animations/up-toggle';
import { CardStackIcon } from '@/assets/icons/card-stack-icon/card-stack-icon';
import { ClockIcon } from '@/assets/icons/clock-icon/clock-icon';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import { StarIcon } from '@/assets/icons/star-icon/star-icon';
import { BubbleDivider } from '@/components/bubble-divider/bubble-divider';
import { Button } from '@/components/button/button';
import { getFormattedMilliseconds } from '@/helpers/time';
import { UpdateCardScoreRequest } from '@/hooks/api/interfaces/card-data';
import { useCardsClient } from '@/hooks/api/use-cards-client';
import { usePrompt } from '@/hooks/use-prompt';
import { MAX_SCORE } from '@/hooks/use-spaced-repetition';
import { Deck } from '@/models/deck';
import { LessonCard } from '@/models/lesson-card';
import { paths } from '@/routing/paths';
import { StudyResultCards } from './study-result-cards/study-result-cards';
import './study-results-page.scss';

interface StudyResultsPageProps {
  deck: Deck;
  lessonCards: LessonCard[];
  onLessonCardsChange: (lessonCards: LessonCard[]) => void;
  lessonTime: number;
}

export const StudyResultsPage = ({
  deck,
  lessonCards,
  lessonTime,
  onLessonCardsChange,
}: StudyResultsPageProps) => {
  const cardsClient = useCardsClient();
  const navigate = useNavigate();
  const { search: queryParams } = useLocation();

  // block navigation if finish isn't clicked; otherwise, redirect back to the deck
  const [areResultsApplied, setAreResultsApplied] = useState(false); // all done?
  const [isUpdating, setIsUpdating] = useState(false); // currently sending update request?
  usePrompt('Are you sure you want to discard the results of this lesson?', !areResultsApplied);
  useEffect(() => {
    if (areResultsApplied) {
      navigate(`${paths.deck}/${deck.metaData.id}`);
    }
  }, [areResultsApplied]);

  const title = `${deck.metaData.title} Lesson Results`;

  return (
    <div className="study-results-page">
      <div className="study-results-page-header">
        <div></div> {/* center title regardless of how much space RHS buttons take up */}
        <h1>{title}</h1>
        {getNavButtons()}
      </div>
      <hr />
      {getLessonStats()}
      <BubbleDivider
        className="studied-cards-divider"
        variantColor="dark"
        variantType="divider"
        label="studied cards"
      />
      <StudyResultCards lessonCards={lessonCards} onLessonCardsChange={onLessonCardsChange} />
    </div>
  );

  function getNavButtons() {
    return (
      <div className="study-results-page-nav-buttons">
        <Button
          size="medium"
          onClick={() => navigate(`${paths.study}/${deck.metaData.id}${queryParams}`)}
        >
          study again
        </Button>
        <Button size="medium" disabled={isUpdating} onClick={handleFinishClick}>
          <UpToggle
            className="finish-lesson-content-container"
            showDefault={!isUpdating}
            defaultContent="finish lesson"
            alternateContent={
              <div className="finish-lesson-loading">
                <LoadingIcon />
                <label>finishing...</label>
              </div>
            }
          />
        </Button>
      </div>
    );
  }

  function getLessonStats() {
    const numCardsStudied = lessonCards.length;
    const totalDeckProgress = '57%'; // TODO: need to decide how we will calculate deck progress and where it will be calculated
    const totalTimeSpent = getFormattedMilliseconds(lessonTime);

    return (
      <>
        <div className="lesson-stat">
          <div className="lesson-stat-label">number of cards studied</div>
          <div className="lesson-stat-result">
            <div className="lesson-stat-number">{numCardsStudied}</div>
            <CardStackIcon className="lesson-stat-icon" />
          </div>
        </div>
        <div className="lesson-stat">
          <div className="lesson-stat-label">total deck progress</div>
          <div className="lesson-stat-result">
            <div className="lesson-stat-number">{totalDeckProgress}</div>
            <StarIcon className="lesson-stat-icon" />
          </div>
        </div>
        <div className="lesson-stat">
          <div className="lesson-stat-label">total time spent</div>
          <div className="lesson-stat-result">
            <div className="lesson-stat-number">{totalTimeSpent}</div>
            <ClockIcon className="lesson-stat-icon" />
          </div>
        </div>
      </>
    );
  }

  async function handleFinishClick() {
    if (isUpdating) {
      return;
    }

    // update card scores
    setIsUpdating(true);
    await _updateAllCardScores();
    setIsUpdating(false);

    // navigation is handled with a side effect on `areResultsApplied`
    setAreResultsApplied(true);
  }

  async function _updateAllCardScores() {
    if (isUpdating) {
      return;
    }

    const scoreUpdates: UpdateCardScoreRequest[] = [];

    // create promise to update cards with new scores
    for (const lessonCard of lessonCards) {
      if (lessonCard.outcome === 'unseen') {
        continue;
      }

      // spaced repetition: if correct, score is increased by 1; otherwise reset to 0
      let newScore = 0;
      if (lessonCard.outcome === 'correct') {
        newScore = Math.min(lessonCard.score + 1, MAX_SCORE);
      }

      if (lessonCard.id) {
        scoreUpdates.push({ id: lessonCard.id, score: newScore });
      } else {
        throw new Error(`Failed to update lesson card: id was undefined`); // this shouldn't be possible...
      }
    }

    return cardsClient.updateCardScores(scoreUpdates);
  }
};
