import { Deck } from '../../models/deck';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /Decks
 */
export function useDecksClient() {
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
  async function getDeckById(id: number): Promise<Deck> {
    throw new Error('Not implemented');
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
    throw new Error('Not implemented');
  }

  // GET: /Decks/Public
  async function getPublicDecks(): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /Decks
  async function addDeck(deck: Deck): Promise<Deck> {
    throw new Error('Not implemented');
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
    throw new Error('Not implemented');
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
