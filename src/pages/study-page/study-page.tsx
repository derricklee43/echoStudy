import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StudyLessonPage } from './study-lesson-page/study-lesson-page';
import { StudyResultsPage } from './study-results-page/study-results-page';
import { Deck } from '../../models/deck';
import { LessonCard } from '../../models/lesson-card';
import './study-page.scss';

interface StudyPageProps {
  deck: Deck;
}

export const StudyPage = ({ deck }: StudyPageProps) => {
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
    return <StudyLessonPage deck={deck} onLessonComplete={handleLessonComplete} />;
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
