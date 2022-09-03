import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCardsClient } from '../../hooks/api/use-cards-client';
import { useDecksClient } from '../../hooks/api/use-decks-client';
import { createNewDeck } from '../../models/deck';
import { LoadingPage } from '../loading-page/loading-page';

interface ResourceLoaderProps<T> {
  routeParameter: string;
  resourceFetcher: (resourceId: string | undefined) => () => Promise<T>;
  resourceConsumer: (resource: T) => JSX.Element;
}

export const ResourceLoader = <T extends React.ReactNode>({
  routeParameter,
  resourceFetcher,
  resourceConsumer,
}: ResourceLoaderProps<T>) => {
  const [resource, setResource] = useState<T | undefined>();
  const { [routeParameter]: resourceId } = useParams();
  const location = useLocation();
  const resourceFetcherClosure = resourceFetcher(resourceId);

  useEffect(() => {
    fetchResourceAndRefresh();
  }, [resourceId, location]);

  if (resource === undefined) {
    return <LoadingPage label="loading page..." />;
  } else {
    return resourceConsumer(resource);
  }

  async function fetchResourceAndRefresh() {
    setResource(undefined);
    const newResource = await resourceFetcherClosure();
    setResource(newResource);
  }
};

export function loadDeck(deckId: string | undefined, allowUndefinedDeckId = false) {
  // hooks outside of functional components must be consumed immediately by the component
  const { getDeckById } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();

  // create a closure around the hooks
  // we can invoke this whenever we actually want to load the resource
  return async () => {
    if (deckId === undefined) {
      if (allowUndefinedDeckId) {
        return createNewDeck();
      }
      throw Error('deckId cannot be undefined');
    }

    const [deck, cards] = await Promise.all([getDeckById(deckId), getCardsByDeckId(deckId)]);
    deck.cards = cards;
    return deck;
  };
}
