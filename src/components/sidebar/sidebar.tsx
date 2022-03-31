import './sidebar.scss';
import React from 'react';
interface SidebarProps {
  onFlashcardDecksClick: (event: React.MouseEvent) => void;
  onCreateClick: (event: React.MouseEvent) => void;
}
export const Sidebar = ({ onFlashcardDecksClick, onCreateClick }: SidebarProps) => {
  return (
    <div className="c-sidebar">
      <label className="c-sidebar-title">
        echo<span>Study</span>
      </label>
      <hr className="c-sidebar-divider" />
      <ul>
        <li>
          <a onClick={onFlashcardDecksClick}>flashcard decks</a>
        </li>
        <li>
          <a onClick={onCreateClick}>create</a>
        </li>
        <li>study</li>
        <li>search</li>
      </ul>
    </div>
  );
};
