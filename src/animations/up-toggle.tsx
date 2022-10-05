import React from 'react';
import { motion } from 'framer-motion';
import { useIsFirstRender } from '@/hooks/use-is-first-render';

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
  const isFirstRender = useIsFirstRender();

  const inactiveVariant = { y: 30, opacity: 0 };
  const variants = {
    active: { y: 0, opacity: 1 },
    inactiveDefault: inactiveVariant,
    inactiveAlternate: { ...inactiveVariant, y: inactiveVariant.y * -1 },
  };

  return (
    <div className={className}>
      {showDefault ? getToggleContent(true) : getToggleContent(false)}
    </div>
  );

  function getToggleContent(isDefaultContent: boolean) {
    const inactiveAnimation = isDefaultContent ? 'inactiveDefault' : 'inactiveAlternate';
    return (
      <motion.div
        className="up-toggle-content"
        variants={variants}
        animate="active"
        initial={!isFirstRender && inactiveAnimation}
        key={isDefaultContent ? 'default' : 'alternate'}
      >
        {isDefaultContent ? defaultContent : alternateContent}
      </motion.div>
    );
  }
};
