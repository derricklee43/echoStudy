import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { asUtcDate } from '@/helpers/time';
import { Deck } from '@/models/deck';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /Decks
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
    return JsonToDeck(deckData); // todo maybe put JsonToDeck into class (and add error checking and rename)
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
  async function addDeck(deck: Deck): Promise<number> {
    const { id } = await fetchWrapper.post('/Decks', deckToJson(deck));
    return id;
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

function deckToJson(deck: Deck) {
  return {
    title: deck.metaData.title,
    description: deck.metaData.desc,
    access: 'Public',
    default_flang: deck.metaData.frontLang,
    default_blang: deck.metaData.backLang,
    userId: 'ad4c76a0-8e0a-4518-b055-5d1dc3ebc4f0', // Todo: replace with id/token
  };
}

function JsonToDeck(obj: any): Deck {
  return {
    metaData: {
      id: obj['id'],
      title: obj['title'],
      desc: obj['description'],
      access: obj['access'],
      frontLang: obj['default_flang'],
      backLang: obj['default_blang'],
      ownerId: obj['ownerId'],
      dateCreated: asUtcDate(obj['date_created']),
      dateUpdated: asUtcDate(obj['date_updated']),
      dateTouched: asUtcDate(obj['date_touched']),
    },
    cards: [],
  };
}
