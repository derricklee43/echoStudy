import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { useCardsClient } from '@/hooks/api/use-cards-client';
import { useDecksClient } from '@/hooks/api/use-decks-client';
import { createNewDeck } from '@/models/deck';

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

export function loadPublicDeck(deckId?: string) {
  // hooks outside of functional components must be consumed immediately by the component
  const { getPublicDeckById } = useDecksClient();
  const { getPublicCardsById } = useCardsClient(); // TODO: A big error happens when this useCardsClient hook is removed
  // React really doesn't like the order of the hooks changing. We might need to get rid of this component entirely

  // create a closure around the hooks
  // we can invoke this whenever we actually want to load the resource
  return async () => {
    if (deckId === undefined) {
      throw Error('deckId cannot be undefined');
    }

    const [deck, cards] = await Promise.all([
      getPublicDeckById(deckId),
      getPublicCardsById(deckId),
    ]);
    deck.cards = cards;
    return deck;
  };
}
