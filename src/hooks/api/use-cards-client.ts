import { useFetchWrapper } from './use-fetch-wrapper';
import { ECHOSTUDY_API_URL, ECHOSTUDY_AUDIO_S3_URL } from '../../helpers/api';
import { Card, createNewCard } from '../../models/card';
import { LazyAudio } from '../../models/lazy-audio';

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
    updateCardScoreById,

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
  async function addCard(card: Card, deckId: number): Promise<number> {
    const { id } = await fetchWrapper.post('/Cards', cardToJson(card, deckId));
    return id;
  }

  // POST: /Cards
  // Todo: Add batching
  async function addCards(cards: Card[], deckId: number): Promise<number[]> {
    return Promise.all(cards.map((card) => addCard(card, deckId)));
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

  // PATCH: /Cards/Touch={id}&{score}
  async function updateCardScoreById(id: number, score: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
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
  return {
    frontText: card.front.text,
    backText: card.back.text,
    frontLang: card.front.language,
    backLang: card.back.language,
    userId: 'ad4c76a0-8e0a-4518-b055-5d1dc3ebc4f0',
    deckId,
  };
}

function JsonToCard(obj: any) {
  const card = createNewCard();
  card.id = obj['id'];
  card.front = {
    language: obj['flang'],
    text: obj['ftext'],
    audio: new LazyAudio(`${ECHOSTUDY_AUDIO_S3_URL}/${obj['faud']}`), // todo: defer new Audio bc some pages don't need it
  };
  card.back = {
    language: obj['blang'],
    text: obj['btext'],
    audio: new LazyAudio(`${ECHOSTUDY_AUDIO_S3_URL}/${obj['baud']}`), // todo: defer new Audio bc some pages don't need it
  };
  return card;
}

function assertIdIsNumber(num: any) {
  if (isNaN(num)) {
    throw new Error(`received id was not a number: ${num}`);
  }
}
