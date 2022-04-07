import './bubble-divider.scss';
import React from 'react';
import { useState } from 'react';
import { Button } from '../button/button';
import { Arrow } from '../../assets/icons/arrow/arrow';
import { motion, AnimatePresence } from 'framer-motion';

interface BubbleDividerProps {
  variantColor?: 'dark' | 'light';
  variantType?: 'divider' | 'drop-down';
  className?: string;
  label: string;
  children?: React.ReactNode;
}

export const BubbleDivider = ({
  variantColor = 'dark',
  variantType = 'divider',
  className = '',
  label,
  children,
}: BubbleDividerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`c-bubble-divider-container ${className}`}>
      <AnimatePresence>{isOpen && getChildren()}</AnimatePresence>
      <div className={`c-bubble-divider ${variantColor}`}>
        <hr />
        <Button className={`c-bubble-button ${variantType}`} onClick={handleBubbleClick}>
          {label}
          {variantType === 'drop-down' && getArrow()}
        </Button>
        <hr />
      </div>
    </div>
  );

  function getChildren() {
    const variants = {
      visible: { height: 'fit-content' },
      hidden: { height: 0 },
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
    if (variantType === 'drop-down') {
      setIsOpen(!isOpen);
    }
  }

  function getArrow() {
    return <Arrow className="c-bubble-divider-arrow" orientation={isOpen ? 'up' : 'down'} />;
  }
};
