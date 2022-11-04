import React from 'react';
import { motion } from 'framer-motion';

interface FadeRevealProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  animateOpacity?: boolean;
}

// wrap in a AnimatePresence for exit animation
export const FadeReveal = ({
  children,
  className = '',
  duration = 0.2,
  animateOpacity = true,
}: FadeRevealProps) => {
  const fadeVariants = {
    visible: {
      height: 'fit-content',
      ...(animateOpacity && { opacity: 0.8 }),
      transitionEnd: { overflow: 'visible', ...(animateOpacity && { opacity: 1.0 }) },
    },
    hidden: { height: 0, overflow: 'hidden', ...(animateOpacity && { opacity: 0.0 }) },
  };

  return (
    <motion.div
      className={className}
      variants={fadeVariants}
      initial={fadeVariants.hidden}
      animate={fadeVariants.visible}
      exit={fadeVariants.hidden}
      transition={{ duration: duration }}
    >
      {children}
    </motion.div>
  );
};
