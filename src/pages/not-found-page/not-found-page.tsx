import React from 'react';
import waveImage from '@/assets/images/wave.png';
import './not-found-page.scss';

export const NotFoundPage = () => {
  return (
    <>
      <div className="not-found-page">
        <div className="code">404.</div>
        <div className="message">Oopsie daisy! Page not found...</div>
        <img className="wave-image" src={waveImage} loading="lazy" />
      </div>
    </>
  );
};
