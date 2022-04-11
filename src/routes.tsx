import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DeckEditorPage } from './pages/deck-editor/deck-editor';
import { FlashcardDecksPage } from './pages/decks/flashcard-decks';

// sidebar navigation is in `./sidebar/sidebar-routes.tsx`
// this component is to define all the possible routes for the app
export const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FlashcardDecksPage />} />
      <Route path="/decks" element={<FlashcardDecksPage />} />
      <Route path="/deck-editor/:deckId" element={<DeckEditorPage />} />
      {/* <Route path="*" element={<TODO: some 404 page should go here />} /> */}
    </Routes>
  );
};
