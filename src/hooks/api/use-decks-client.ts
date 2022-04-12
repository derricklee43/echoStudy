import { Deck } from '../../models/deck';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /api/Decks
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

  // GET: /api/Decks/{id}
  async function getDeckById(id: number): Promise<Deck> {
    throw new Error('Not implemented');
  }

  // GET: /api/Decks/UserEmail={userEmail}
  async function getDecksByEmail(userEmail: string): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: /api/Decks/User={userId}
  async function getDecksByUserId(userId: number): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: ​/api​/Decks​/DeckCategory={categoryId}
  async function getDecksByCategoryId(categoryId: number): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: /api/Decks
  async function getAllDecks(): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  // GET: /api/Decks/Public
  async function getPublicDecks(): Promise<Deck[]> {
    throw new Error('Not implemented');
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /api/Decks
  async function addDeck(deck: Deck): Promise<Deck> {
    throw new Error('Not implemented');
  }

  // PUT: /api/Decks/{id}
  async function updateDeckById(id: number, deck: Deck): Promise<void> {
    throw new Error('Not implemented');
  }

  // PATCH: /api/Decks/Touch={id}
  async function touchDeckById(id: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
  }

  /////////////////
  /// deletions ///
  /////////////////

  // DELETE: /api/Decks/{id}
  async function deleteDeckById(id: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /api/Decks/DeleteUserDecks={userId}
  async function deleteDecksByUserId(userId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /api/Decks/DeleteUserDecksByEmail={userEmail}
  async function deleteDecksByEmail(userEmail: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
