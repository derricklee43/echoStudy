import './loading-page.scss';
import React from 'react';
import { LoadingIcon } from '../../assets/icons/loading-icon/loading-icon';
import { motion } from 'framer-motion';

interface LoadingPageProps {
  className?: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  fadeIn?: boolean;
}

export const LoadingPage = ({ className = '', label = 'loading deck...' }: LoadingPageProps) => {
  const variants = {
    invisible: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      transition: { delay: 1.5 },
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
