import './reorder-button-strip.scss';
import React, { useState } from 'react';
import { FlashcardArrowIcon } from '../../../assets/icons/flashcard-arrow-icon/flashcard-arrow-icon';
import { Button } from '../../button/button';
import { AnimatePresence, motion } from 'framer-motion';
import { ReorderIcon } from '../../../assets/icons/reorder-icon/reorder-icon';

interface ReorderButtonStripProps {
  variant: 'active' | 'inactive';
  isDragging: boolean;
  dragHandle: string;
  index: number;
  onUpClick: (event: React.MouseEvent) => void;
  onDownClick: (event: React.MouseEvent) => void;
}

export const ReorderButtonStrip = ({
  variant,
  isDragging,
  dragHandle,
  index,
  onUpClick,
  onDownClick,
}: ReorderButtonStripProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const showIndex = !isHovering && !isDragging;

  const indexIcon = <label>{index}</label>;
  const reorderIcon = (
    <ReorderIcon
      variant={variant}
      className={`${dragHandle} strip-reorder-icon ${isDragging && 'drag'} `}
    />
  );

  const iconKey = showIndex ? 'index' : 'reorder';
  const icon = showIndex ? indexIcon : reorderIcon;

  return (
    <div
      className={`reorder-button-strip ${variant}`}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button onClick={onUpClick} variant="invisible" ariaLabel="up-arrow">
        <FlashcardArrowIcon orientation="up" variant={variant} />
      </Button>
      <div className="center-icon">
        <AnimatePresence>
          <motion.div
            key={iconKey}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        </AnimatePresence>
      </div>
      <Button onClick={onDownClick} variant="invisible" ariaLabel="down-arrow">
        <FlashcardArrowIcon variant={variant} />
      </Button>
    </div>
  );
};
