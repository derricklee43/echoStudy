import { Deck } from '../../models/deck';
import { useFetchWrapper } from './use-fetch-wrapper';
import { ECHOSTUDY_API_URL } from '../../helpers/api';

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
    const decksData = await fetchWrapper.get('/Decks');
    return decksData.map(JsonToDeck); // todo maybe put JsonToDeck into class (and add error checking and rename)
  }

  // GET: /Decks/Public
  async function getPublicDecks(): Promise<Deck[]> {
    const decksData = await fetchWrapper.get('/Decks/Public');
    return decksData.map(JsonToDeck); // todo maybe put JsonToDeck into class (and add error checking and rename)
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /Decks
  async function addDeck(deck: Deck) {
    const jsonDeck = {
      title: deck.metaData.title,
      description: deck.metaData.desc,
      access: 'Public',
      default_flang: deck.metaData.frontLang,
      default_blang: deck.metaData.backLang,
      userEmail: 'JANEDOE@GMAIL.COM', // Todo: replace with real user
      cardIds: [],
    };
    const response = await fetchWrapper.post('/Decks', jsonDeck);
    return {
      metaData: {
        id: response['deckID'], // when adding a deck response use deckId instead of id: request change
        title: response['title'],
        desc: response['description'],
        access: response['access'],
        frontLang: response['default_flang'],
        backLang: response['default_blang'],
        ownerId: response['ownerId'],
        dateCreated: new Date(response['date_created']),
        dateUpdated: new Date(response['date_updated']),
        dateTouched: new Date(response['date_touched']),
      },
      cards: [],
    };
  }

  // PUT: /Decks/{id}
  async function updateDeckById(id: number, deck: Deck): Promise<void> {
    throw new Error('Not implemented');
  }

  // PATCH: /Decks/Touch={id}
  async function touchDeckById(id: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
  }

  /////////////////
  /// deletions ///
  /////////////////

  // DELETE: /Decks/{id}
  async function deleteDeckById(id: number): Promise<void> {
    return await fetchWrapper.delete(`/Decks/${id}`);
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
      dateCreated: new Date(obj['date_created']),
      dateUpdated: new Date(obj['date_updated']),
      dateTouched: new Date(obj['date_touched']),
    },
    cards: [],
  };
}
