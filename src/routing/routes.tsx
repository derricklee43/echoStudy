import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  loadDeck,
  loadPublicDeck,
  ResourceLoader,
} from '@/components/resource-loader/resource-loader';
import { AlreadyAuthorizedLayout } from '@/layouts/already-authorized-layout/already-authorized-layout';
import { AuthorizedRouteLayout } from '@/layouts/authorized-route-layout/authorized-route-layout';
import { FullscreenLayout } from '@/layouts/full-screen-layout/full-screen-layout';
import { SidebarLayout } from '@/layouts/sidebar-layout/sidebar-layout';
import { Deck } from '@/models/deck';
import { FlashcardDecksPage } from '@/pages/decks-page/flashcard-decks';
import { EditDeckPage } from '@/pages/edit-deck-page/edit-deck-page';
import { LandingPage } from '@/pages/landing-page/landing-page';
import { NotFoundPage } from '@/pages/not-found-page/not-found-page';
import { PersonalProfilePage } from '@/pages/profile-page/personal-profile-page/personal-profile-page';
import { ProfilePage } from '@/pages/profile-page/profile-page';
import { SearchPage } from '@/pages/search-page/search-page';
import { SignInPage } from '@/pages/sign-in-page/sign-in-page';
import { SignUpPage } from '@/pages/sign-up-page/sign-up-page';
import { StudyPage } from '@/pages/study-page/study-page';
import { ViewPersonalDeckPage } from '@/pages/view-deck-pages/view-personal-deck-page/view-personal-deck-page';
import { ViewPublicDeckPage } from '@/pages/view-deck-pages/view-public-deck-page/view-public-deck-page';
import { paths } from './paths';

// sidebar navigation is in `./sidebar/sidebar-routes.tsx`
// this component is to define all the possible routes for the app
export const PageRoutes = () => {
  return (
    <Routes>
      <Route element={<SidebarLayout />}>
        <Route element={<AuthorizedRouteLayout />}>
          <Route path={paths.decks} element={<FlashcardDecksPage />} />
          <Route path={`${paths.deck}/:deckId`} element={getViewDeckPage()} />
          <Route path={`${paths.publicDecks}/:deckId`} element={getPublicDeckPage()} />
          <Route path={`${paths.editDeck}/:deckId`} element={getEditDeckPage(false)} />
          <Route path={paths.createDeck} element={getEditDeckPage(true)} />
          <Route path={`${paths.study}/:deckId`} element={getStudyPage()} />
          <Route path={`${paths.users}/:username`} element={<ProfilePage />} />
          <Route path={`${paths.profile}`} element={<PersonalProfilePage />} />
          <Route path={paths.search} element={<SearchPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<FullscreenLayout />}>
        <Route element={<AlreadyAuthorizedLayout />}>
          <Route path={paths.signIn} element={<SignInPage />} />
          <Route path={paths.signUp} element={<SignUpPage />} />
        </Route>
        <Route path={paths.home} element={<LandingPage />} />
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

function getPublicDeckPage() {
  const viewDeckPageClosure = (deck: Deck) => <ViewPublicDeckPage deck={deck} />;
  return (
    <ResourceLoader
      routeParameter="deckId"
      resourceFetcher={loadPublicDeck}
      resourceConsumer={viewDeckPageClosure}
    />
  );
}

function getViewDeckPage() {
  const viewDeckPageClosure = (deck: Deck) => <ViewPersonalDeckPage deck={deck} />;
  return (
    <ResourceLoader
      routeParameter="deckId"
      resourceFetcher={loadDeck}
      resourceConsumer={viewDeckPageClosure}
    />
  );
}
