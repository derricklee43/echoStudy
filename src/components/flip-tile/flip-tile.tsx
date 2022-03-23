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
    <div className={`flip-tile ${className || ''}`} onClick={onClick}>
      <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="front">{front}</div>
        <div className="back">{back}</div>
      </div>
    </div>
  );
};
