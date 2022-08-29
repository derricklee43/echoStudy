import React from 'react';
import './flip-tile.scss';

interface FlipTileProps {
  isFlipped: boolean;
  front: JSX.Element;
  back: JSX.Element;
  className?: string;
  onClick: (event: React.MouseEvent) => void;
}

export const FlipTile = ({ isFlipped, front, back, className, onClick }: FlipTileProps) => {
  return (
    <div className={`c-flip-tile ${className || ''}`} onClick={onClick}>
      <div className={`c-card ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="c-front">{front}</div>
        <div className="c-back">{back}</div>
      </div>
    </div>
  );
};
