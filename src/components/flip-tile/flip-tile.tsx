import React, { ReactNode } from 'react';
import './flip-tile.scss';

interface FlipTileProps {
  isFlipped: boolean;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  onClick: (event: React.MouseEvent) => void;
}

/**
 * @prop className controls the size and margin of the flip tile
 * @prop frontClassName is forwarded to the front side of the card
 * @prop backClassName is forwarded to the front side of the card
 */
export const FlipTile = ({
  isFlipped,
  front,
  back,
  className = '',
  frontClassName = '',
  backClassName = '',
  onClick,
}: FlipTileProps) => {
  return (
    <div className={`c-flip-tile ${className}`} onClick={onClick}>
      <div className={`c-card ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="c-front">
          <div className={`tile-content ${frontClassName}`}>
            <div className="c-front-inner">{front}</div>
          </div>
        </div>
        <div className="c-back">
          <div className={`tile-content ${backClassName}`}>{back}</div>
        </div>
      </div>
    </div>
  );
};
