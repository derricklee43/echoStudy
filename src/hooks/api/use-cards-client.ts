import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { isDefined, isNumber } from '@/helpers/validator';
import { Card, cardToJson, DraftCard, JsonToCard } from '@/models/card';
import { NewCardsResponse, UpdateCardScoreRequest } from './interfaces/card-data';
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

    getPublicCardsById,

    // adds & updates
    addCard,
    addCards,
    updateCard,
    updateCards,
    updateCardScores,

    // removals
    deleteCard,
    deleteCards,
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

  // GET: /Cards​?deckId={deckId}
  async function getCardsByDeckId(deckId: string): Promise<Card[]> {
    const cardsData = await fetchWrapper.get(`/cards?deckId=${deckId}`);
    return cardsData.map(JsonToCard);
  }

  // GET: /Cards
  async function getAllCards(): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: Public/Cards​?deckId={deckId}
  async function getPublicCardsById(deckId: number | string): Promise<Card[]> {
    const cardsData = await fetchWrapper.get(`/public/cards?deckId=${deckId}`);
    return cardsData.map(JsonToCard);
  }
  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /Cards
  async function addCard(card: DraftCard | Card, deckId: number): Promise<NewCardsResponse> {
    return addCards([card], deckId);
  }

  // POST: /Cards
  async function addCards(cards: DraftCard[] | Card[], deckId: number): Promise<NewCardsResponse> {
    const cardsToAdd = Promise.all(cards.map((card) => cardToJson(card, deckId)));
    const response = await fetchWrapper.post('/cards', cardsToAdd);
    return response;
  }

  // POST: /Cards/Update
  async function updateCard(card: DraftCard | Card): Promise<NewCardsResponse> {
    return updateCards([card]);
  }

  // POST: /Cards/Update
  async function updateCards(cards: DraftCard[] | Card[]): Promise<NewCardsResponse> {
    cards.forEach((card) => assertIdIsNumber(card.id));
    const cardsToUpdate = await Promise.all(cards.map((card) => cardToJson(card)));
    const response = await fetchWrapper.post(`/cards/update`, cardsToUpdate);
    return response;
  }

  // POST: /Cards/Study
  async function updateCardScores(cardScores: UpdateCardScoreRequest[]): Promise<void> {
    return fetchWrapper.post('/cards/study', cardScores);
  }

  /////////////////
  /// deletions ///
  /////////////////

  // POST: /Cards/Delete
  async function deleteCard(card: Card): Promise<void> {
    assertIdIsNumber(card.id);
    return deleteCards([card]);
  }

  // POST: /Cards/Delete
  async function deleteCards(cards: Card[]): Promise<void> {
    cards.forEach((card) => assertIdIsNumber(card.id));

    const cardsToDelete = cards.map((card) => card.id).filter(isDefined);
    return fetchWrapper.post(`/cards/delete`, cardsToDelete);
  }
}

function assertIdIsNumber(num: number | undefined) {
  if (!isNumber(num) || isNaN(num)) {
    throw new Error(`received id was not a number: ${num}`);
  }
}
