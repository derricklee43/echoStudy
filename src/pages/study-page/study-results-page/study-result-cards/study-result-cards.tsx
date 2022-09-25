import React, { ReactNode, useState } from 'react';
import { CorrectIcon } from '../../../../assets/icons/correct-icon/correct-icon';
import { IncorrectIcon } from '../../../../assets/icons/incorrect-icon/incorrect-icon';
import { SkippedIcon } from '../../../../assets/icons/skipped-icon/skipped-icon';
import { DropDownOption } from '../../../../components/drop-down-options/drop-down-options';
import { KebabMenu } from '../../../../components/kebab-menu/kebab-menu';
import {
  ReadOnlyFlashcard,
  ReadOnlyFlashcardVariant,
} from '../../../../components/read-only-flashcard/read-only-flashcard';
import { useLazyAudioPlayer } from '../../../../hooks/use-lazy-audio-player';
import { LessonCard, LessonCardOutcome, LessonCardOutcomes } from '../../../../models/lesson-card';
import './study-result-cards.scss';

interface StudyResultCardsProps {
  lessonCards: LessonCard[];
  onLessonCardsChange: (lessCards: LessonCard[]) => void;
}

export const StudyResultCards = ({ lessonCards, onLessonCardsChange }: StudyResultCardsProps) => {
  const [openMenuCardKey, setOpenMenuCardKey] = useState('');
  const { playLazyAudio } = useLazyAudioPlayer();

  const variants: Record<LessonCardOutcome, ReadOnlyFlashcardVariant> = {
    correct: 'green',
    incorrect: 'red',
    unseen: 'light-blue',
  };

  const icons: Record<LessonCardOutcome, React.ReactNode> = {
    correct: <CorrectIcon />,
    incorrect: <IncorrectIcon />,
    unseen: <SkippedIcon />,
  };

  return (
    <>
      {lessonCards.map((card) => {
        const icon = icons[card.outcome];
        const variant = variants[card.outcome];
        return (
          <div key={card.key} className="study-results-flashcard-container">
            <div className="study-results-flashcard-icon">{icon}</div>
            <ReadOnlyFlashcard
              className="study-results-flashcard"
              variant={variant}
              frontText={card.front.text}
              backText={card.back.text}
              onFrontSpeakerClick={() => playLazyAudio(card.front.audio)}
              onBackSpeakerClick={() => playLazyAudio(card.back.audio)}
            />
            <div className="study-results-flashcard-icon">
              <KebabMenu
                variant={variant}
                isOpen={card.key === openMenuCardKey}
                setIsOpen={(isOpen) => handleSetIsOpen(isOpen, card.key)}
                onOptionSelect={(option) => handleOptionSelect(option, card.key)}
                options={getOptions(card.outcome)}
              />
            </div>
          </div>
        );
      })}
    </>
  );

  function getOptions(outcome: LessonCardOutcome) {
    const optionsText: Record<LessonCardOutcome, string> = {
      correct: 'mark as correct',
      incorrect: 'mark as incorrect',
      unseen: 'mark as skipped',
    };

    const options: DropDownOption<LessonCardOutcome, ReactNode>[] = LessonCardOutcomes.map(
      (outcome) => {
        const value = <div className="study-results-card-option">{optionsText[outcome]}</div>;
        return { id: outcome, focusable: true, value };
      }
    );

    return options.filter((option) => option.id !== outcome);
  }

  function handleSetIsOpen(isOpen: boolean, cardKey: string) {
    if (!isOpen && openMenuCardKey !== cardKey) {
      return;
    }
    setOpenMenuCardKey(isOpen ? cardKey : '');
  }

  function handleOptionSelect(
    option: DropDownOption<LessonCardOutcome, ReactNode>,
    cardKey: string
  ) {
    const index = lessonCards.findIndex((card) => card.key === cardKey);
    const newLessonCards = [...lessonCards];
    newLessonCards[index] = { ...newLessonCards[index], outcome: option.id };

    onLessonCardsChange(newLessonCards);
    setOpenMenuCardKey('');
  }
};
