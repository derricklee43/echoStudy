import React, { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Deck } from '@/models/deck';
import { LessonCard } from '@/models/lesson-card';
import {
  StudyConfigPopup,
  StudyConfiguration,
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
  const [hasLessonConfigured, setHasLessonConfigured] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [lessonCards, setLessonCards] = useState<LessonCard[]>([]);
  const [lessonTime, setLessonTime] = useState(0);

  // state retrieved from navigation payload
  // this is used to prefill the lesson config from other pages
  const location = useLocation();
  const prefillStudyConfig = location.state as StudyConfiguration;

  // parse URL query params for study configuration
  const [searchParams] = useSearchParams();
  const parsedMaxCards = parseInt(searchParams.get('maxCards') ?? '');
  const studyConfig: StudyConfiguration = {
    studyType: (searchParams.get('studyType') as StudyType) ?? 'new-cards',
    order: (searchParams.get('order') as SortRule) ?? 'random',
    maxCards: isNaN(parsedMaxCards) ? 5 : parsedMaxCards,
  };

  // on page load: study configuration popup if settings provided
  if (!hasLessonConfigured && Array.from(searchParams).length === 0) {
    return (
      <StudyConfigPopup
        studyConfig={prefillStudyConfig ?? undefined}
        deck={deck}
        showPopup={!hasLessonConfigured}
        onClose={() => setHasLessonConfigured(true)}
      />
    );
  }
  // lesson already configured, switch between the correct page
  else {
    let key = 'lesson';
    let page = getStudyLessonPage();
    if (isLessonComplete) {
      key = 'results';
      page = getStudyLessonResultsPage();
    }

    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={key}
          className="study-page-view-container"
          initial={{ x: 15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -15, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {page}
        </motion.div>
      </AnimatePresence>
    );
  }

  function getStudyLessonPage() {
    return (
      <StudyLessonPage
        deck={deck}
        studyConfig={studyConfig}
        onLessonComplete={handleLessonComplete}
      />
    );
  }
  function getStudyLessonResultsPage() {
    return (
      <StudyResultsPage
        deck={deck}
        studyConfig={studyConfig}
        lessonCards={lessonCards}
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
