import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { createNewDeck, Deck } from '../../models/deck';
import { LoadingPage } from '../loading-page/loading-page';

interface ResourceLoaderProps<T> {
  resourceFetcher: (resourceId: string | undefined) => Promise<T>;
  resourceConsumer: (resource: T) => JSX.Element;
  useParamsIdName: string;
}

export const ResourceLoader = <T extends React.ReactNode>({
  useParamsIdName,
  resourceConsumer,
  resourceFetcher,
}: ResourceLoaderProps<T>) => {
  const [resource, setResource] = useState<T | undefined>();
  const { [useParamsIdName]: resourceId } = useParams();
  const location = useLocation();

  useEffect(() => {
    fetchResourceAndRefresh();
  }, [resourceId, location]);

  if (resource === undefined) {
    return <LoadingPage label="loading page..." />;
  }

  return resourceConsumer(resource);

  async function fetchResourceAndRefresh() {
    setResource(undefined);
    const newResource = await resourceFetcher(resourceId);
    setResource(newResource);
  }
};

export async function loadDeck(deckId: string | undefined, allowUndefinedDeckId = false) {
  const { getDeckById } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();

  if (deckId === undefined) {
    if (allowUndefinedDeckId) {
      return createNewDeck();
    }
    throw Error('deckId cannot be undefined');
  }

  const [deck, cards] = await Promise.all([getDeckById(deckId), getCardsByDeckId(deckId)]);
  deck.cards = cards;
  return deck;
}
