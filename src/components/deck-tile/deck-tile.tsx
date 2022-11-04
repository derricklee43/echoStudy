import React from 'react';
import './deck-tile.scss';

export interface DeckTileProps {
  title: string;
  numCards: number;
  description: string;
  author?: string;
  onClick?: () => void;
}

export const DeckTile = ({ title, numCards, description, author, onClick }: DeckTileProps) => {
  return (
    <button className="deck-tile" onClick={() => onClick?.()}>
      <div className="dt-title dt-text-light-blue">{title}</div>
      <div className="dt-text-gray">{numCards} cards</div>
      <p className="dt-description dt-text-light-blue">{description}</p>
      {author !== undefined && <div className="dt-author dt-text-gray">by {author}</div>}
    </button>
  );
};
