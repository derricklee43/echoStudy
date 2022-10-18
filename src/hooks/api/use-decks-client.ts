import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { Deck, deckToJson, JsonToDeck } from '@/models/deck';
import { NewDecksResponse } from './interfaces/deck-data';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints for /Decks
 */
export function useDecksClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return {
    // queries
    getDeckById,
    getDecksByEmail,
    getDecksByUserId,
    getDecksByCategoryId,
    getAllDecks,
    getPublicDecks,

    // adds & updates
    addDeck,
    updateDeckById, // there exists the same endpoint for PATCH, but logic seems to be quite similar
    touchDeckById,

    // removals
    deleteDeckById,
    deleteDecksByUserId,
    deleteDecksByEmail,
  };

  ///////////////
  /// queries ///
  ///////////////

  // GET: /Decks/{id}
  async function getDeckById(id: string): Promise<Deck> {
    const deckData = await fetchWrapper.get(`/Decks/${id}`);
    return JsonToDeck(deckData);
  }

  // GET: /Decks/UserEmail={userEmail}
  async function getDecksByEmail(userEmail: string): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: /Decks/User={userId}
  async function getDecksByUserId(userId: number): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: ​/Decks​/DeckCategory={categoryId}
  async function getDecksByCategoryId(categoryId: number): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: /Decks
  async function getAllDecks(): Promise<Deck[]> {
    const decksData = (await fetchWrapper.get('/Decks')) ?? [];
    return decksData.map(JsonToDeck); // todo maybe put JsonToDeck into class (and add error checking and rename)
  }

  // GET: /Decks/Public
  async function getPublicDecks(): Promise<Deck[]> {
    const decksData = (await fetchWrapper.get('/Decks/Public')) ?? [];
    return decksData.map(JsonToDeck); // todo maybe put JsonToDeck into class (and add error checking and rename)
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /Decks
  async function addDeck(deck: Deck): Promise<NewDecksResponse> {
    const response = await fetchWrapper.post('/Decks', [deckToJson(deck)]);
    return response;
  }

  // POST: /Decks/{id}
  async function updateDeckById(deck: Deck): Promise<number> {
    const { id } = await fetchWrapper.post(`/Decks/${deck.metaData.id}`, deckToJson(deck));
    return id;
  }

  // PATCH: /Decks/Touch={id}
  async function touchDeckById(id: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
  }

  /////////////////
  /// deletions ///
  /////////////////

  // Post: /Decks/Delete/{id}
  async function deleteDeckById(id: number): Promise<void> {
    return fetchWrapper.post(`/Decks/Delete/${id}`);
  }

  // DELETE: /Decks/DeleteUserDecks={userId}
  async function deleteDecksByUserId(userId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /Decks/DeleteUserDecksByEmail={userEmail}
  async function deleteDecksByEmail(userEmail: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
