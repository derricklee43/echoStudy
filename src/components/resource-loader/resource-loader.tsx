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
  const { [useParamsIdName]: resourceId } = useParams(); // via the param :deckId
  const location = useLocation();

  useEffect(() => {
    fetchDeckAndRefresh();
  }, [resourceId, location]);

  if (resource === undefined) {
    return <LoadingPage label="loading deck..." />;
  }

  return resourceConsumer(resource);

  async function fetchDeckAndRefresh() {
    setResource(undefined);
    const newResource = await resourceFetcher(resourceId);
    setResource(newResource);
  }
};

export function loadDeck(deckId: string | undefined, allowUndefinedDeckId = false) {
  const { getDeckById } = useDecksClient();
  const { getCardsByDeckId } = useCardsClient();

  return new Promise<Deck>(async (resolve, reject) => {
    if (deckId === undefined) {
      if (allowUndefinedDeckId) {
        return resolve(createNewDeck());
      }
      return reject('deckId cannot be undefined');
    }
    const deck = await getDeckById(deckId);
    deck.cards = await getCardsByDeckId(deckId);
    resolve(deck);
  });
}