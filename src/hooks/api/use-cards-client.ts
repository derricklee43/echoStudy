import { ECHOSTUDY_API_URL } from '../../helpers/api';
import { Card, createNewCard } from '../../models/card';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /Cards
 */
export function useCardsClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return {
    // queries
    getCardById,
    getCardsByEmail,
    getCardsByUserId,
    getCardsByDeckId,
    getAllCards,

    // adds & updates
    addCard,
    updateCardById, // there exists the same endpoint for PATCH, but logic seems to be quite similar
    updateCardScoreById,

    // removals
    deleteCard,
    deleteCardsByUserId,
    deleteCardsByEmail,
    deleteCardsByDeckId,
  };

  ///////////////
  /// queries ///
  ///////////////

  // GET: /Cards/{id}
  async function getCardById(id: number): Promise<Card> {
    throw new Error('Not implemented');
  }

  // GET: /Cards/UserEmail={userEmail}
  async function getCardsByEmail(userEmail: string): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: ​/Cards​/User={userId}
  async function getCardsByUserId(userId: number): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: /Cards​/Deck={deckId}
  async function getCardsByDeckId(deckId: string): Promise<Card[]> {
    const cardsData = await fetchWrapper.get(`/Cards?deckId=${deckId}`);
    return cardsData.map(JsonToCard);
  }

  // GET: /Cards
  async function getAllCards(): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /Cards
  async function addCard(deckId: number, card: Card): Promise<Card> {
    throw new Error('Not implemented');
  }

  // PUT: /Cards/{id}
  async function updateCardById(id: number, card: Card): Promise<Card> {
    throw new Error('Not implemented');
  }

  // PATCH: /Cards/Touch={id}&{score}
  async function updateCardScoreById(id: number, score: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
  }

  /////////////////
  /// deletions ///
  /////////////////

  // DELETE: /Cards/{id}
  async function deleteCard(card: Card): Promise<void> {
    if (card.id === undefined) {
      throw new Error('card id cannot be undefined');
    }
    throw new Error('Not implemented');
  }

  // DELETE: /Cards/DeleteUserCards={userId}
  async function deleteCardsByUserId(userId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /Cards​/DeleteUserCardsByEmail={userEmail}
  async function deleteCardsByEmail(userEmail: string): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /Cards/DeleteDeckCards={deckId}
  async function deleteCardsByDeckId(deckId: number): Promise<void> {
    throw new Error('Not implemented');
  }
}

function JsonToCard(obj: any) {
  const card = createNewCard();
  card.id = obj['id'];
  card.front = {
    language: obj['flang'],
    text: obj['ftext'],
    audio: obj['faud'],
  };
  card.back = {
    language: obj['blang'],
    text: obj['btext'],
    audio: obj['baud'],
  };
  return card;
}
