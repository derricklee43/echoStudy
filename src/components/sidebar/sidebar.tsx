import './sidebar.scss';
import React from 'react';
interface SidebarProps {
  onFlashcardDecksClick: (event: React.MouseEvent) => void;
}
export const Sidebar = ({ onFlashcardDecksClick }: SidebarProps) => {
  return (
    <div className="c-sidebar">
      <label className="c-title">
        echo<span>Study</span>
      </label>
      <hr className="c-sidebar-divider" />
      <ul>
        <li>
          <a onClick={onFlashcardDecksClick}>flashcard decks</a>
        </li>
        <li>create</li>
        <li>study</li>
        <li>search</li>
      </ul>
    </div>
  );
};
