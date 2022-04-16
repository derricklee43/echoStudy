import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EditDeckPage } from './pages/edit-deck-page/edit-deck-page';
import { FlashcardDecksPage } from './pages/decks/flashcard-decks';

export const enum paths {
  home = '/',
  decks = '/decks',
  editDeck = '/edit-deck',
  createDeck = '/create-deck',
  study = '/study',
  search = '/search',
}

// sidebar navigation is in `./sidebar/sidebar-routes.tsx`
// this component is to define all the possible routes for the app
export const PageRoutes = () => {
  return (
    <Routes>
      <Route path={paths.home} element={<FlashcardDecksPage />} />
      <Route path={paths.decks} element={<FlashcardDecksPage />} />
      <Route path={`${paths.editDeck}/:deckId`} element={<EditDeckPage />} />
      <Route path={paths.createDeck} element={<EditDeckPage />} />
      {/* <Route path="*" element={<TODO: some 404 page should go here />} /> */}
    </Routes>
  );
};
