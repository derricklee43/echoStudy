import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BubbleDivider } from '@/components/bubble-divider/bubble-divider';
import { DeckTile } from '@/components/deck-tile/deck-tile';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { UserDetails } from '@/components/user-details/user-details';
import { usePublicUsersClient } from '@/hooks/api/use-public-users-client';
import { Deck } from '@/models/deck';
import { PublicUser } from '@/models/public-user';
import { paths } from '@/routing/paths';
import './public-profile-page.scss';

export const PublicProfilePage = () => {
  const [publicUser, setPublicUser] = useState<PublicUser>();
  const { username } = useParams();
  const { getPublicUser } = usePublicUsersClient();
  const navigate = useNavigate();

  useEffect(() => {
    setPublicUser(undefined);
    fetchUserAndRefresh();
  }, [username]);

  if (publicUser === undefined) {
    return <LoadingPage label="loading user..." />;
  }

  const decks = publicUser.publicDecks;
  return (
    <div className="public-profile-page">
      <UserDetails
        username={publicUser.username}
        dateJoined={publicUser.dateCreated}
        profilePicUrl={publicUser.profilePicUrl}
      />
      <BubbleDivider variantType="divider" label={`public decks (${decks.length})`} />
      {decks.length > 0 ? getDeckTiles(decks) : getNoDeckMessage()}
    </div>
  );

  function getDeckTiles(decks: Deck[]) {
    const deckTiles = decks.map((deck) => {
      const deckId = deck.metaData.id;
      return (
        <DeckTile
          onClick={() => navigate(`${paths.publicDecks}/${deck.metaData.id}`)}
          key={deckId}
          title={deck.metaData.title}
          description={deck.metaData.desc}
          numCards={deck.metaData.cardIds.length}
        />
      );
    });
    return <div className="decks-container">{deckTiles}</div>;
  }

  function getNoDeckMessage() {
    return <div className="no-decks-message">user currently has no public decks</div>;
  }

  async function fetchUserAndRefresh() {
    if (username !== undefined) {
      const publicUser = await getPublicUser(username);
      setPublicUser(publicUser);
    }
  }
};
