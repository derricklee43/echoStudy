import './study-flashcard.scss';
import React, { ReactNode } from 'react';
import { FlipTile } from '../flip-tile/flip-tile';
import { AnimatePresence, motion } from 'framer-motion';
import { noop } from '../../helpers/func';

interface StudyFlashcardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  activeSide: 'front' | 'back';
  variant: 'light' | 'dark';
  frontLabel?: string;
  backLabel?: string;
  key: string;
}

export const StudyFlashcard = ({
  frontContent,
  frontLabel = '',
  backContent,
  backLabel = '',
  activeSide,
  variant,
  key,
}: StudyFlashcardProps) => {
  // TODO: Allow card to be flippable, but reset on the content changes
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={key}
        initial={{ x: 15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -15, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <FlipTile
          className="study-card"
          isFlipped={activeSide !== 'front'}
          front={getCardFace(frontContent, frontLabel)}
          frontClassName={'dark'}
          back={getCardFace(backContent, backLabel)}
          onClick={noop}
        />
      </motion.div>
    </AnimatePresence>
  );

  function getCardFace(content: ReactNode, label: string) {
    return (
      <div className={`c-study-flashcard-content  ${variant}`}>
        <label className="c-study-flashcard-side-label">{label}</label>
        {content}
      </div>
    );
  }
};
