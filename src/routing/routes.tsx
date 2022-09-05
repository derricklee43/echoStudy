import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { paths } from './paths';
import { loadDeck, ResourceLoader } from '../components/resource-loader/resource-loader';
import { FullscreenLayout } from '../layouts/full-screen-layout/full-screen-layout';
import { SidebarLayout } from '../layouts/sidebar-layout/sidebar-layout';
import { Deck } from '../models/deck';
import { FlashcardDecksPage } from '../pages/decks/flashcard-decks';
import { EditDeckPage } from '../pages/edit-deck-page/edit-deck-page';
import { LandingPage } from '../pages/landing-page/landing-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';
import { StudyPage } from '../pages/study-page/study-page';
import { ViewDeckPage } from '../pages/view-deck-page/view-deck-page';

// sidebar navigation is in `./sidebar/sidebar-routes.tsx`
// this component is to define all the possible routes for the app
export const PageRoutes = () => {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route path={paths.decks} element={<FlashcardDecksPage />} />
        <Route path={`${paths.deck}/:deckId`} element={getViewDeckPage()} />
        <Route path={`${paths.editDeck}/:deckId`} element={getEditDeckPage(false)} />
        <Route path={paths.createDeck} element={getEditDeckPage(true)} />
        <Route path={`${paths.study}/:deckId`} element={getStudyPage()} />
      </Route>

      <Route element={<FullscreenLayout />}>
        <Route path={paths.home} element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

function getStudyPage() {
  const studyPageClosure = (deck: Deck) => <StudyPage deck={deck} />;
  return (
    <ResourceLoader
      routeParameter="deckId"
      resourceFetcher={loadDeck}
      resourceConsumer={studyPageClosure}
    />
  );
}

function getEditDeckPage(allowUndefinedDeckId: boolean) {
  const editDeckPageClosure = (deck: Deck) => <EditDeckPage deck={deck} />;
  return (
    <ResourceLoader
      routeParameter="deckId"
      resourceFetcher={(deckId: string | undefined) => loadDeck(deckId, allowUndefinedDeckId)}
      resourceConsumer={editDeckPageClosure}
    />
  );
}

function getViewDeckPage() {
  const viewDeckPageClosure = (deck: Deck) => <ViewDeckPage deck={deck} />;
  return (
    <ResourceLoader
      routeParameter="deckId"
      resourceFetcher={loadDeck}
      resourceConsumer={viewDeckPageClosure}
    />
  );
}
