import './study-flashcard.scss';
import React, { ReactNode, useState } from 'react';
import { FlipTile } from '../flip-tile/flip-tile';
import { AnimatePresence, motion } from 'framer-motion';
import { motion as d } from 'framer-motion-3d';

interface StudyFlashcardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  activeSide: 'front' | 'back';
  variant: 'light' | 'dark';
}

export const StudyFlashcard = ({
  frontContent,
  backContent,
  activeSide,
  variant,
}: StudyFlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        whileHover={{ rotateY: 180, rotateZ: 10 }}
        transition={{ duration: 1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <d.div
          className="study-page-card"
          key={frontContent?.toString() ?? 1}
          initial={{ x: 15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -15, y: -15, opacity: 0, backgroundColor: '#82fa61' }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        >
          {getFront()}

          {/* <div className="c-study-flashcard">
          <FlipTile
            isFlipped={activeSide !== 'front'}
            front={getFront()}
            back={getBack()}
            onClick={onClickHandler}
          />
        </div> */}
        </d.div>
      </motion.div>
    </AnimatePresence>
  );

  function getBack() {
    return <div className={`c-study-flashcard-content ${variant}`}>{backContent}</div>;
  }

  function getFront() {
    return <div className={`c-study-flashcard-content  ${variant}`}>{frontContent}</div>;
  }

  function onClickHandler() {
    setIsFlipped(!isFlipped);
  }
};
