import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BubbleDivider } from '@/components/bubble-divider/bubble-divider';
import { DeckCover } from '@/components/deck-cover/deck-cover';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { PageHeader } from '@/components/page-header/page-header';
import { useAccountClient } from '@/hooks/api/use-account-client';
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
  const accountClient = useAccountClient();
  const decksClient = useDecksClient();

  const setUserDecks = useSetRecoilState(userDecksState);
  const sortedDecks = useRecoilValue(userDecksSortedState);
  const userData = useRecoilValue(userInfoStateAsync);

  const pfpUrl = accountClient.getProfilePictureUrl(userData?.email ?? '');
  const { privateDecks, publicDecks } = _reduceDecksByAccess();

  const [deckStudySelection, setDeckStudySelection] = useState<Deck>();

  // fetch flashcard decks on load
  useEffect(() => {
    fetchDecksAndRefresh();
  }, []);

  return (
    <>
      <div className="pg-profile-page">
        <div className="profile-page-header">
          <PageHeader label="my profile" />
        </div>
        <div className="user-details">
          <div className="profile-picture-container">
            <img className="profile-picture" src={pfpUrl} loading="lazy" />
          </div>
          <span className="username">{`@${userData?.username}`}</span>
          <span className="full-name">{userData?.email.toLowerCase()}</span>
          <span className="date-joined">member since 2022</span>
        </div>
        <BubbleDivider
          className="decks-divider"
          variantType="drop-down-reveal"
          label={`private decks (${privateDecks.length})`}
        >
          {privateDecks.length > 0 && (
            <div className="decks-container">{getDeckCovers(privateDecks)}</div>
          )}
        </BubbleDivider>
        <BubbleDivider
          className="decks-divider"
          variantType="drop-down-reveal"
          label={`public decks (${publicDecks.length})`}
        >
          {publicDecks.length > 0 && (
            <div className="decks-container">{getDeckCovers(publicDecks)}</div>
          )}
        </BubbleDivider>
      </div>

      {deckStudySelection && (
        <StudyConfigPopup
          deck={deckStudySelection}
          showPopup={!!deckStudySelection}
          onClose={() => setDeckStudySelection(undefined)}
        />
      )}
    </>
  );

  function getDeckCovers(decks: Deck[]) {
    return decks.map((deck) => {
      const deckId = deck.metaData.id;
      return (
        <DeckCover
          key={deckId}
          deck={deck}
          onStudyClick={() => setDeckStudySelection(deck)}
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
