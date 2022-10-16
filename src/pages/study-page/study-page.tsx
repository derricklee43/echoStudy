import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Deck } from '@/models/deck';
import { LessonCard } from '@/models/lesson-card';
import {
  StudyConfigQueryParams,
  StudyType,
} from '@/pages/_shared/study-config-popup/study-config-popup';
import { SortRule } from '@/state/user-decks';
import { StudyLessonPage } from './study-lesson-page/study-lesson-page';
import { StudyResultsPage } from './study-results-page/study-results-page';
import './study-page.scss';

interface StudyPageProps {
  deck: Deck;
}

export const StudyPage = ({ deck }: StudyPageProps) => {
  // data retrieved from URL navigation state
  const [searchParams] = useSearchParams();
  const parsedMaxCards = parseInt(searchParams.get('maxCards') ?? '');
  const configParams: StudyConfigQueryParams = {
    studyType: (searchParams.get('studyType') as StudyType) ?? 'new-cards',
    order: (searchParams.get('order') as SortRule) ?? 'random',
    maxCards: isNaN(parsedMaxCards) ? 5 : parsedMaxCards,
  };

  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [lessonCards, setLessonCards] = useState<LessonCard[]>([]);
  const [lessonTime, setLessonTime] = useState(0);

  let page: React.ReactNode = getStudyLessonPage();
  let key = 'lesson';
  if (isLessonComplete) {
    page = getStudyLessonResultsPage();
    key = 'results';
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={key}
        initial={{ x: 15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -15, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {page}
      </motion.div>
    </AnimatePresence>
  );

  function getStudyLessonPage() {
    return (
      <StudyLessonPage
        deck={deck}
        configParams={configParams}
        onLessonComplete={handleLessonComplete}
      />
    );
  }
  function getStudyLessonResultsPage() {
    return (
      <StudyResultsPage
        lessonCards={lessonCards}
        deck={deck}
        lessonTime={lessonTime}
        onLessonCardsChange={setLessonCards}
      />
    );
  }

  function handleLessonComplete(lessonCards: LessonCard[], lessonTime: number) {
    setIsLessonComplete(true);
    setLessonCards(lessonCards);
    setLessonTime(lessonTime);
  }
};
