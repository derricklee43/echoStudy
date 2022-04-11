import React from 'react';
import { motion } from 'framer-motion';

interface FadeProps {
  children: React.ReactNode;
  fadeIn?: boolean;
  className?: string;
}

// wrap in a AnimatePresence for exit animation
export const Fade = ({ children, fadeIn = true, className = '' }: FadeProps) => {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={fadeIn && variants.hidden}
      animate={variants.visible}
      exit={variants.hidden}
      transition={{ duration: 0.2 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};
