import React from 'react';
import { motion } from 'framer-motion';

interface FadeProps {
  children: React.ReactNode;
}

// wrap in a AnimatePresence for exit animation
export const Fade = ({ children }: FadeProps) => {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };
  return (
    <motion.div
      variants={variants}
      initial={variants.hidden}
      animate={variants.visible}
      exit={variants.hidden}
      transition={{ duration: 0.2 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};
