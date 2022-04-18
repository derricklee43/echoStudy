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
  const [inactiveY, setInactiveY] = useState(0);
  const [inactiveOpacity, setInactiveOpacity] = useState(1);

  // enables transition after mount
  useEffect(() => {
    setInactiveY(-30);
    setInactiveOpacity(0);
  }, []);

  const variants = {
    active: { y: 0, opacity: 1 },
    inactiveDefault: { y: inactiveY, opacity: inactiveOpacity },
    inactiveAlternate: { y: -1 * inactiveY, opacity: inactiveOpacity },
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
