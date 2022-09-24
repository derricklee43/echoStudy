import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowIcon } from '../../assets/icons/arrow-icon/arrow-icon';
import { Button } from '../button/button';
import './bubble-divider.scss';

interface BubbleDividerProps {
  variantColor?: 'dark' | 'light';
  variantType?: 'divider' | 'drop-down' | 'drop-down-reveal';
  className?: string;
  buttonClassName?: string;
  label: string;
  children?: React.ReactNode;
}

export const BubbleDivider = ({
  variantColor = 'dark',
  variantType = 'divider',
  className = '',
  buttonClassName = '',
  label,
  children,
}: BubbleDividerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // should the divider move with the content (hugs the bottom)?
  const shouldParchmentScroll = variantType !== 'drop-down-reveal';

  return (
    <div className={`c-bubble-divider-container ${className}`}>
      {shouldParchmentScroll && <AnimatePresence>{isOpen && getChildren()}</AnimatePresence>}
      <div className={`c-bubble-divider ${variantColor}`}>
        <hr />
        <Button
          className={`c-bubble-button ${variantType} ${buttonClassName}`}
          onClick={handleBubbleClick}
        >
          {label}
          {['drop-down', 'drop-down-reveal'].includes(variantType) && getArrow()}
        </Button>
        <hr />
      </div>
      {!shouldParchmentScroll && <AnimatePresence>{isOpen && getChildren()}</AnimatePresence>}
    </div>
  );

  function getChildren() {
    const variants = {
      visible: { height: 'fit-content', transitionEnd: { overflow: 'visible' } },
      hidden: { height: 0, overflow: 'hidden' },
    };

    return (
      <motion.div
        className="c-bubble-divider-children"
        key={'children'}
        variants={variants}
        initial={'hidden'}
        exit={'hidden'}
        animate={'visible'}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  function handleBubbleClick() {
    if (['drop-down', 'drop-down-reveal'].includes(variantType)) {
      setIsOpen(!isOpen);
    }
  }

  function getArrow() {
    let orientation: 'up' | 'down' | undefined;

    if (variantType === 'drop-down') {
      orientation = isOpen ? 'up' : 'down';
    } else if (variantType === 'drop-down-reveal') {
      orientation = isOpen ? 'down' : 'up';
    }

    return <ArrowIcon className="c-bubble-divider-arrow" orientation={orientation} />;
  }
};
