import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BubbleDivider } from '@/components/bubble-divider/bubble-divider';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PageHeader } from '@/components/page-header/page-header';
import { ProfilePicture } from '@/components/profile-picture/profile-picture';
import { useDecksClient } from '@/hooks/api/use-decks-client';
import { Deck } from '@/models/deck';
import { StudyConfigPopup } from '@/pages/_shared/study-config-popup/study-config-popup';
import { paths } from '@/routing/paths';
import { userInfoStateAsync } from '@/state/auth-jwt';
import { userDecksSortedState, userDecksState } from '@/state/user-decks';
import './profile-page.scss';

export const ProfilePage = () => {
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <AsyncProfilePage />
    </React.Suspense>
  );
};

const AsyncProfilePage = () => {
  const navigate = useNavigate();
  const decksClient = useDecksClient();

  const setUserDecks = useSetRecoilState(userDecksState);
  const sortedDecks = useRecoilValue(userDecksSortedState);
  const userData = useRecoilValue(userInfoStateAsync);

  const { privateDecks, publicDecks } = _reduceDecksByAccess();

  // fetch flashcard decks on load
  useEffect(() => {
    fetchDecksAndRefresh();
  }, []);

  return (
    <div className="pg-profile-page">
      <div className="profile-page-header">
        <PageHeader label="my profile" />
      </div>
      <div className="user-details">
        <ProfilePicture username={userData?.email} showGlow={true} />
        <span className="username">{`@${userData?.username}`}</span>
        <span className="full-name">{userData?.email.toLowerCase()}</span>
        <span className="date-joined">member since 2022</span>
      </div>
    </div>
  );

  function getDeckCovers(decks: Deck[]) {
    return decks.map((deck) => {
      const deckId = deck.metaData.id;
      return (
        <DeckCover
          key={deckId}
          deck={deck}
          onStudyClick={() => navigate(`${paths.study}/${deckId}`)}
          onViewClick={() => navigate(`${paths.deck}/${deckId}`)}
        />
      );
    });
  }

  function _reduceDecksByAccess() {
    return (sortedDecks ?? []).reduce(
      (result: Record<'privateDecks' | 'publicDecks', Deck[]>, deck: Deck) => {
        const accessLevel = deck.metaData.access;
        const key = accessLevel === 'Private' ? 'privateDecks' : 'publicDecks';
        result[key].push(deck);
        return result;
      },
      { privateDecks: [], publicDecks: [] }
    );
  }

  async function fetchDecksAndRefresh() {
    const fetchedDecks = await decksClient.getAllDecks();
    setUserDecks(fetchedDecks);
  }
};
