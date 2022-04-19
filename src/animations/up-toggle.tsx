import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useEffect } from 'react';

interface UpToggleProps {
  className?: string;
  showDefault: boolean;
  defaultContent: React.ReactNode;
  alternateContent: React.ReactNode;
}

export const UpToggle = ({
  className = '',
  showDefault = true,
  defaultContent,
  alternateContent,
}: UpToggleProps) => {
  // prevents transition on mount
  const [isFirstRender, setIsFirstRender] = useState(true);

  // enables transition after mount
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const yOffset = 30;
  const activeVariant = { y: 0, opacity: 1 };
  const inactiveVariant = isFirstRender ? activeVariant : { y: yOffset, opacity: 0 };

  const variants = {
    active: activeVariant,
    inactiveDefault: inactiveVariant,
    inactiveAlternate: { ...inactiveVariant, y: yOffset * -1 },
  };

  return (
    <div className={className}>
      {showDefault ? getToggleContent(true) : getToggleContent(false)}
    </div>
  );

  function getToggleContent(isDefaultContent: boolean) {
    return (
      <motion.div
        className="up-toggle-content"
        variants={variants}
        animate="active"
        initial={isDefaultContent ? 'inactiveDefault' : 'inactiveAlternate'}
        key={isDefaultContent ? 'default' : 'alternate'}
      >
        {isDefaultContent ? defaultContent : alternateContent}
      </motion.div>
    );
  }
};
