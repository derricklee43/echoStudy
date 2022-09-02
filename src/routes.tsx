import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { loadDeck, ResourceLoader } from './components/resource-loader/resource-loader';
import { Deck } from './models/deck';
import { FlashcardDecksPage } from './pages/decks/flashcard-decks';
import { EditDeckPage } from './pages/edit-deck-page/edit-deck-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { StudyPage } from './pages/study-page/study-page';
import { ViewDeckPage } from './pages/view-deck-page/view-deck-page';

export const enum paths {
  home = '/',
  decks = '/decks',
  deck = '/deck',
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
      <Route path={`${paths.deck}/:deckId`} element={getViewDeckPage()} />
      <Route path={`${paths.editDeck}/:deckId`} element={getEditDeckPage(false)} />
      <Route path={paths.createDeck} element={getEditDeckPage(true)} />
      <Route path={`${paths.study}/:deckId`} element={getStudyPage()} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function getStudyPage() {
  const studyPageClosure = (deck: Deck) => <StudyPage deck={deck} />;
  return (
    <ResourceLoader
      useParamsIdName="deckId"
      resourceFetcher={loadDeck}
      resourceConsumer={studyPageClosure}
    />
  );
}

function getEditDeckPage(allowUndefinedDeckId: boolean) {
  const editDeckPageClosure = (deck: Deck) => <EditDeckPage deck={deck} />;
  return (
    <ResourceLoader
      useParamsIdName="deckId"
      resourceFetcher={(deckId: string | undefined) => loadDeck(deckId, allowUndefinedDeckId)}
      resourceConsumer={editDeckPageClosure}
    />
  );
}

function getViewDeckPage() {
  const viewDeckPageClosure = (deck: Deck) => <ViewDeckPage deck={deck} />;
  return (
    <ResourceLoader
      useParamsIdName="deckId"
      resourceFetcher={loadDeck}
      resourceConsumer={viewDeckPageClosure}
    />
  );
}
