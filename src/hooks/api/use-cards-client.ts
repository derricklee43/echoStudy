import { ECHOSTUDY_API_URL, ensureHttps } from '@/helpers/api';
import { asUtcDate } from '@/helpers/time';
import { Card, createNewCard } from '@/models/card';
import { LazyAudio } from '@/models/lazy-audio';
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

    // adds & updates
    addCard,
    addCards,
    updateCardById,
    updateCardsById,
    updateCardScores,

    // removals
    deleteCard,
    deleteCards,
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

  // GET: /Cards​?deckId={deckId}
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
  async function addCard(card: Card, deckId: number): Promise<NewCardsResponse> {
    return addCards([card], deckId);
  }

  // POST: /Cards (batching)
  async function addCards(cards: Card[], deckId: number): Promise<NewCardsResponse> {
    const cardsToAdd = cards.map((card) => cardToJson(card, deckId));
    const response = await fetchWrapper.post('/Cards', cardsToAdd);
    return response;
  }

  // POST: /Cards/{id}
  async function updateCardById(card: Card): Promise<number> {
    assertIdIsNumber(card.id);
    const { id } = await fetchWrapper.post(`/Cards/${card.id}`, cardToJson(card));
    return id;
  }

  // POST: /Cards/{id}
  // Todo: Add batching
  async function updateCardsById(cards: Card[]): Promise<number[]> {
    return Promise.all(cards.map((card) => updateCardById(card)));
  }

  // POST: /Cards/Study
  async function updateCardScores(cardScores: UpdateCardScoreRequest[]): Promise<void> {
    return fetchWrapper.post('/Cards/Study', cardScores);
  }

  /////////////////
  /// deletions ///
  /////////////////

  // POST: /Cards/Delete/{id}
  async function deleteCard(card: Card): Promise<void> {
    assertIdIsNumber(card.id);
    fetchWrapper.post(`/Cards/Delete/${card.id}`);
  }

  // POST: /Cards/Delete/{id}
  // Todo: Add Batching
  async function deleteCards(cards: Card[]): Promise<void> {
    Promise.all(cards.map((card) => deleteCard(card)));
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

function cardToJson(card: Card, deckId?: number) {
  // TODO: backend needs to support way to update score
  return {
    frontText: card.front.text,
    backText: card.back.text,
    frontLang: card.front.language,
    backLang: card.back.language,
    userId: 'ad4c76a0-8e0a-4518-b055-5d1dc3ebc4f0',
    deckId,
  };
}

function JsonToCard(obj: any): Card {
  const card = createNewCard();
  card.id = obj['id'];
  card.score = obj['score'];
  card.dateCreated = asUtcDate(obj['date_created']);
  card.dateUpdated = asUtcDate(obj['date_updated']);
  card.dateTouched = asUtcDate(obj['date_touched']);
  card.front = {
    language: obj['flang'],
    text: obj['ftext'],
    audio: new LazyAudio(ensureHttps(obj['faud'])),
  };
  card.back = {
    language: obj['blang'],
    text: obj['btext'],
    audio: new LazyAudio(ensureHttps(obj['baud'])),
  };
  return card;
}

function assertIdIsNumber(num: any) {
  if (isNaN(num)) {
    throw new Error(`received id was not a number: ${num}`);
  }
}
