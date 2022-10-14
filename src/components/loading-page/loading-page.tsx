import React from 'react';
import { motion } from 'framer-motion';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import './loading-page.scss';

interface LoadingPageProps {
  className?: string;
  label?: string;
  labelDelay?: number; // in seconds
}

export const LoadingPage = ({ className = '', label = '', labelDelay = 1.5 }: LoadingPageProps) => {
  const variants = {
    invisible: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      transition: { delay: labelDelay },
      y: 0,
    },
  };

  return (
    <div className={`c-loading-page ${className}`}>
      <LoadingIcon size="large" />
      <motion.div
        className="c-loading-page-label"
        variants={variants}
        animate={'visible'}
        initial={'invisible'}
      >
        {label}
      </motion.div>
    </div>
  );
};
